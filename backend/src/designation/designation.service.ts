
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DesignationService {
  constructor(private readonly prisma: PrismaService) {}
 // Génère un ID de désignation unique basé sur le mois et l'année
  private async generateDesignationId(
    tx: Prisma.TransactionClient,
  ): Promise<string> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const existing = await tx.designationSequence.findUnique({
      where: {
        month_year: {
          month,
          year,
        },
      },
    });

    let counter: number;

    if (!existing) {
      const created = await tx.designationSequence.create({
        data: {
          month,
          year,
          counter: 1,
        },
      });
      counter = created.counter;
    } else {
      const updated = await tx.designationSequence.update({
        where: {
          month_year: {
            month,
            year,
          },
        },
        data: {
          counter: { increment: 1 },
        },
      });
      counter = updated.counter;
    }

    const formattedCounter = String(counter).padStart(3, '0');
    const formattedMonth = String(month).padStart(2, '0');

    return `DES-${formattedMonth}-${year}-${formattedCounter}`;
  }

 // Crée une nouvelle désignation et recalcule les totaux du document associé
  async create(data: {
    description: string;
    quantity: string | number;
    unitPrice: string | number;
    documentId: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const document = await tx.document.findUnique({
        where: { id: data.documentId },
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      const id = await this.generateDesignationId(tx);

      const quantity = new Prisma.Decimal(data.quantity);
      const unitPrice = new Prisma.Decimal(data.unitPrice);
      const total = quantity.mul(unitPrice);

      const designation = await tx.designation.create({
        data: {
          id,
          description: data.description,
          quantity,
          unitPrice,
          total,
          documentId: data.documentId,
        },
      });

      await this.recalculateDocumentTotals(tx, data.documentId);

      return designation;
    });
  }

 // Génère un ID de désignation unique basé sur le mois et l'année
  async update(
    id: string,
    data: {
      description?: string;
      quantity?: string | number;
      unitPrice?: string | number;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.designation.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Designation not found');
      }

      const quantity = data.quantity
        ? new Prisma.Decimal(data.quantity)
        : existing.quantity;

      const unitPrice = data.unitPrice
        ? new Prisma.Decimal(data.unitPrice)
        : existing.unitPrice;

      const total = quantity.mul(unitPrice);

      const updated = await tx.designation.update({
        where: { id },
        data: {
          description: data.description ?? existing.description,
          quantity,
          unitPrice,
          total,
        },
      });

      await this.recalculateDocumentTotals(tx, existing.documentId);

      return updated;
    });
  }

 // Supprime une désignation et recalcule les totaux du document associé
  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const designation = await tx.designation.findUnique({
        where: { id },
      });

      if (!designation) {
        throw new NotFoundException('Designation not found');
      }

      await tx.designation.delete({
        where: { id },
      });

      await this.recalculateDocumentTotals(tx, designation.documentId);

      return { message: 'Designation deleted successfully' };
    });
  }

   // Génère un ID de désignation unique basé sur le mois et l'année
  private async recalculateDocumentTotals(
    tx: Prisma.TransactionClient,
    documentId: string,
  ) {
    const designations = await tx.designation.findMany({
      where: { documentId },
    });

    const totalHT = designations.reduce(
      (sum, item) => sum.add(item.total),
      new Prisma.Decimal(0),
    );

    const document = await tx.document.findUnique({
      where: { id: documentId },
    });

    if (!document) return;

    const tvaAmount = totalHT.mul(document.tva).div(100);
    const totalTTC = totalHT.add(tvaAmount);

    await tx.document.update({
      where: { id: documentId },
      data: {
        totalHT,
        totalTTC,
      },
    });
  }
}