
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Prisma,
  DocumentType,
  DevisStatus,
  FactureStatus,
  Currency,
} from '@prisma/client';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

 // Génère un ID de document unique basé sur le type, le mois et l'année
  private async generateDocumentId(
    tx: Prisma.TransactionClient,
    type: DocumentType,
  ): Promise<string> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const prefix = type === DocumentType.DEVIS ? 'DEV' : 'FAC';

    const existing = await tx.documentSequence.findUnique({
      where: {
        prefix_month_year: {
          prefix,
          month,
          year,
        },
      },
    });

    let counter: number;

    if (!existing) {
      const created = await tx.documentSequence.create({
        data: { prefix, month, year, counter: 1 },
      });
      counter = created.counter;
    } else {
      const updated = await tx.documentSequence.update({
        where: {
          prefix_month_year: { prefix, month, year },
        },
        data: { counter: { increment: 1 } },
      });
      counter = updated.counter;
    }

    const formattedMonth = String(month).padStart(2, '0');
    const formattedCounter = String(counter).padStart(3, '0');

    return `${prefix}-${formattedMonth}-${year}-${formattedCounter}`;
  }
// Crée un nouveau document
  async create(data: {
    type: DocumentType;
    tierId: string;
    currency: Currency;
    tva: string | number;
    dueDate?: Date;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const tier = await tx.tier.findUnique({
        where: { id: data.tierId },
      });

      if (!tier) {
        throw new NotFoundException('Tier not found');
      }

      const id = await this.generateDocumentId(tx, data.type);

      const tva = new Prisma.Decimal(data.tva);

      return tx.document.create({
        data: {
          id,
          type: data.type,
          tierId: data.tierId,
          currency: data.currency,
          tva,
          totalHT: new Prisma.Decimal(0),
          totalTTC: new Prisma.Decimal(0),
          date: new Date(),
          dueDate: data.dueDate,

          devisStatus:
            data.type === DocumentType.DEVIS
              ? DevisStatus.ON_HOLD
              : null,

          factureStatus:
            data.type === DocumentType.FACTURE
              ? FactureStatus.NOT_PAID
              : null,
        },
      });
    });
  }

 // Récupère tous les documents avec leurs tiers et désignations associés
  findAll() {
    return this.prisma.document.findMany({
      include: {
        tier: true,
        designations: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

 // Récupère un document spécifique par ID avec son tier et ses désignations associés
  findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
      include: {
        tier: true,
        designations: true,
      },
    });
  }


 // Met à jour un document existant
  async update(
    id: string,
    data: {
      dueDate?: Date;
      tva?: string | number;
      currency?: Currency;
      devisStatus?: DevisStatus;
      factureStatus?: FactureStatus;
    },
  ) {
    const existing = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Document not found');
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        dueDate: data.dueDate ?? existing.dueDate,
        currency: data.currency ?? existing.currency,
        tva: data.tva
          ? new Prisma.Decimal(data.tva)
          : existing.tva,
        devisStatus: data.devisStatus ?? existing.devisStatus,
        factureStatus: data.factureStatus ?? existing.factureStatus,
      },
    });
  }

 // Supprime un document par ID
  async remove(id: string) {
    const existing = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Document not found');
    }

    return this.prisma.document.delete({
      where: { id },
    });
  }
}