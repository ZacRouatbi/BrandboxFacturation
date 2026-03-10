import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DesignationService } from '../designation/designation.service';
import {
  Prisma,
  DocumentType,
  DevisStatus,
  FactureStatus,
  Currency,
  TierRole,
} from '@prisma/client';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma:             PrismaService,
    private readonly designationService: DesignationService,
  ) {}

  // ── Document ID generation ─────────────────────────────────────
  private async generateDocumentId(
    tx:   Prisma.TransactionClient,
    type: DocumentType,
  ): Promise<string> {
    const now    = new Date();
    const month  = now.getMonth() + 1;
    const year   = now.getFullYear();
    const prefix = type === DocumentType.DEVIS ? 'DEV' : 'FAC';
    const mm     = String(month).padStart(2, '0');

    if (type === DocumentType.DEVIS) {
      // Devis: counter resets every month — DEV-MM-YY-NNN
      const existing = await tx.documentSequence.findUnique({
        where: { prefix_month_year: { prefix, month, year } },
      });

      let counter: number;
      if (!existing) {
        const created = await tx.documentSequence.create({
          data: { prefix, month, year, counter: 1 },
        });
        counter = created.counter;
      } else {
        const updated = await tx.documentSequence.update({
          where: { prefix_month_year: { prefix, month, year } },
          data:  { counter: { increment: 1 } },
        });
        counter = updated.counter;
      }

      const seq = String(counter).padStart(3, '0');
      return `${prefix}-${mm}-${year}-${seq}`;

    } else {
      // Facture: counter never resets, global per year — FAC-MM-YY-NNN
      const existing = await tx.documentSequence.findUnique({
        where: { prefix_year: { prefix, year } },
      });

      let counter: number;
      if (!existing) {
        const created = await tx.documentSequence.create({
          data: { prefix, year, counter: 1 },
        });
        counter = created.counter;
      } else {
        const updated = await tx.documentSequence.update({
          where: { prefix_year: { prefix, year } },
          data:  { counter: { increment: 1 } },
        });
        counter = updated.counter;
      }

      const seq = String(counter).padStart(3, '0');
      return `${prefix}-${mm}-${year}-${seq}`;
    }
  }

  // ── Create document + designations atomically ──────────────────
  async create(data: {
    type:         DocumentType;
    tierId:       string;
    currency:     Currency;
    tva:          string | number;
    hasTva:       boolean;
    dueDate?:     string | Date | null;
    designations: {
      description: string;
      quantity:    number;
      unitPrice:   number;
    }[];
  }) {
    return this.prisma.$transaction(async (tx) => {
      const tier = await tx.tier.findUnique({ where: { id: data.tierId } });
      if (!tier) throw new NotFoundException('Tier not found');

      const id  = await this.generateDocumentId(tx, data.type);
      const tva = data.hasTva ? new Prisma.Decimal(data.tva) : new Prisma.Decimal(0);

      // Create document shell first (totals start at 0)
      await tx.document.create({
        data: {
          id,
          type:     data.type,
          tierId:   data.tierId,
          currency: data.currency,
          tva,
          totalHT:  new Prisma.Decimal(0),
          totalTTC: new Prisma.Decimal(0),
          date:     new Date(),
          dueDate:  data.dueDate ? new Date(data.dueDate) : null,
          devisStatus:
            data.type === DocumentType.DEVIS ? DevisStatus.ON_HOLD : null,
          factureStatus:
            data.type === DocumentType.FACTURE ? FactureStatus.NOT_PAID : null,
        },
      });

      // Delegate designation creation to DesignationService
      for (const d of data.designations) {
        await this.designationService.createInTransaction(tx, {
          description: d.description,
          quantity:    d.quantity,
          unitPrice:   d.unitPrice,
          documentId:  id,
        });
      }

      // Recalculate totals once all designations are in
      await this.designationService.recalculateDocumentTotals(tx, id);

      return tx.document.findUnique({
        where:   { id },
        include: { tier: true, designations: true },
      });
    });
  }

  // ── Find all (paginated + filtered) ───────────────────────────
  async findAll(
    page:         number = 1,
    limit:        number = 10,
    type?:        DocumentType,
    dateFrom?:    string,
    dateTo?:      string,
    dueDateFrom?: string,
    dueDateTo?:   string,
  ) {
    const skip  = (page - 1) * limit;
    const where: Prisma.DocumentWhereInput = {
      ...(type ? { type } : {}),
      ...(dateFrom || dateTo ? {
        date: {
          ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
          ...(dateTo   ? { lte: new Date(dateTo)   } : {}),
        },
      } : {}),
      ...(dueDateFrom || dueDateTo ? {
        dueDate: {
          ...(dueDateFrom ? { gte: new Date(dueDateFrom) } : {}),
          ...(dueDateTo   ? { lte: new Date(dueDateTo)   } : {}),
        },
      } : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.document.findMany({
        where,
        include:  { tier: true, designations: true },
        orderBy:  { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ── Find one ───────────────────────────────────────────────────
  async findOne(id: string) {
    const doc = await this.prisma.document.findUnique({
      where:   { id },
      include: { tier: true, designations: true },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  // ── Update ─────────────────────────────────────────────────────
  async update(
    id: string,
    data: {
      dueDate?:       string | Date | null;
      tva?:           string | number;
      currency?:      Currency;
      devisStatus?:   DevisStatus;
      factureStatus?: FactureStatus;
    },
  ) {
    const existing = await this.prisma.document.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Document not found');

    const tvaNeedsRecalc = data.tva !== undefined || data.currency !== undefined;

    return this.prisma.$transaction(async (tx) => {
      await tx.document.update({
        where: { id },
        data: {
          dueDate:       data.dueDate !== undefined
            ? (data.dueDate ? new Date(data.dueDate) : null)
            : existing.dueDate,
          currency:      data.currency      ?? existing.currency,
          tva:           data.tva !== undefined
            ? new Prisma.Decimal(data.tva)
            : existing.tva,
          devisStatus:   data.devisStatus   ?? existing.devisStatus,
          factureStatus: data.factureStatus ?? existing.factureStatus,
        },
      });

      if (tvaNeedsRecalc) {
        await this.designationService.recalculateDocumentTotals(tx, id);
      }

      return tx.document.findUnique({
        where:   { id },
        include: { tier: true, designations: true },
      });
    });
  }

  // ── Convert devis → facture ────────────────────────────────────
  async convertToFacture(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const devis = await tx.document.findUnique({
        where:   { id },
        include: { designations: true },
      });

      if (!devis)
        throw new NotFoundException('Devis not found');
      if (devis.type !== DocumentType.DEVIS)
        throw new BadRequestException('Document is not a devis');
      if (devis.devisStatus === DevisStatus.CANCELLED)
        throw new BadRequestException('Cannot convert a cancelled devis');

      const factureId = await this.generateDocumentId(tx, DocumentType.FACTURE);

      // Create facture shell
      await tx.document.create({
        data: {
          id:            factureId,
          type:          DocumentType.FACTURE,
          tierId:        devis.tierId,
          currency:      devis.currency,
          tva:           devis.tva,
          totalHT:       new Prisma.Decimal(0),
          totalTTC:      new Prisma.Decimal(0),
          date:          new Date(),
          dueDate:       devis.dueDate ? new Date(devis.dueDate) : null,
          factureStatus: FactureStatus.NOT_PAID,
        },
      });

      // Copy designations via DesignationService
      for (const d of devis.designations) {
        await this.designationService.createInTransaction(tx, {
          description: d.description,
          quantity:    d.quantity.toNumber(),
          unitPrice:   d.unitPrice.toNumber(),
          documentId:  factureId,
        });
      }

      // Recalculate facture totals
      await this.designationService.recalculateDocumentTotals(tx, factureId);

      // Mark devis as accepted
      await tx.document.update({
        where: { id },
        data:  { devisStatus: DevisStatus.ACCEPTED },
      });

      const facture = await tx.document.findUnique({
        where:   { id: factureId },
        include: { tier: true, designations: true },
      });

      return { devisId: id, facture };
    });
  }

  // ── Delete ─────────────────────────────────────────────────────
  async remove(id: string) {
    const existing = await this.prisma.document.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Document not found');
    return this.prisma.document.delete({ where: { id } });
  }
  // ── Dashboard stats ─────────────────────────────────────────────
  async getStats() {
    const now       = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      totalClients,
      totalFournisseurs,
      devisEnAttente,
      facturesNonPayees,
      // This month
      facturesThisMonth,
      devisAcceptesThisMonth,
      // Last month
      facturesLastMonth,
      devisAcceptesLastMonth,
      // Recent activity
      recentDocs,
    ] = await this.prisma.$transaction([
      this.prisma.tier.count({ where: { role: { in: [TierRole.CLIENT, TierRole.BOTH] } } }),
      this.prisma.tier.count({ where: { role: { in: [TierRole.FOURNISSEUR, TierRole.BOTH] } } }),
      this.prisma.document.count({ where: { type: 'DEVIS', devisStatus: 'ON_HOLD' } }),
      this.prisma.document.count({ where: { type: 'FACTURE', factureStatus: 'NOT_PAID' } }),

      this.prisma.document.findMany({
        where: { type: 'FACTURE', date: { gte: thisMonth } },
        select: { totalTTC: true, factureStatus: true },
      }),
      this.prisma.document.count({
        where: { type: 'DEVIS', devisStatus: 'ACCEPTED', date: { gte: thisMonth } },
      }),

      this.prisma.document.findMany({
        where: { type: 'FACTURE', date: { gte: lastMonth, lte: lastMonthEnd } },
        select: { totalTTC: true },
      }),
      this.prisma.document.count({
        where: { type: 'DEVIS', devisStatus: 'ACCEPTED', date: { gte: lastMonth, lte: lastMonthEnd } },
      }),

      this.prisma.document.findMany({
        take:    8,
        orderBy: { date: 'desc' },
        include: { tier: true },
      }),
    ]);

    const caThisMonth  = facturesThisMonth.reduce((s, d) => s + Number(d.totalTTC), 0);
    const caLastMonth  = facturesLastMonth.reduce((s, d) => s + Number(d.totalTTC), 0);
    const caTrend      = caLastMonth === 0 ? null : Math.round(((caThisMonth - caLastMonth) / caLastMonth) * 100);

    const devisTrend   = devisAcceptesLastMonth === 0 ? null
      : Math.round(((devisAcceptesThisMonth - devisAcceptesLastMonth) / devisAcceptesLastMonth) * 100);

    return {
      ca:               caThisMonth,
      totalClients,
      totalFournisseurs,
      devisEnAttente,
      facturesNonPayees,
      devisAcceptesThisMonth,
      caTrend,
      devisTrend,
      recentActivity:   recentDocs,
    };
  }
}

  