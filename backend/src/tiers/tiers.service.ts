import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TierRole } from '@prisma/client';

@Injectable()
export class TierService {
  constructor(private readonly prisma: PrismaService) {}
     // Génère un ID de tier unique basé sur le rôle, le mois et l'année
  private async generateTierId(role: TierRole): Promise<string> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let prefix = '';

    switch (role) {
      case TierRole.CLIENT:
        prefix = 'CLI';
        break;
      case TierRole.FOURNISSEUR:
        prefix = 'FOU';
        break;
      case TierRole.BOTH:
        prefix = 'TIE';
        break;
    }
// Utilise une transaction pour garantir l'unicité du compteur
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.tierSequence.findUnique({
        where: {
          prefix_month_year: {
            prefix,
            month,
            year,
          },
        },
      });

      let counter: number;
// Si aucune séquence n'existe pour ce préfixe, mois et année, en créer une nouvelle, sinon incrémenter le compteur existant
      if (!existing) {
        const created = await tx.tierSequence.create({
          data: {
            prefix,
            month,
            year,
            counter: 1,
          },
        });
        counter = created.counter;
      } else {
        // Incrémente le compteur existant et récupère la nouvelle valeur
        const updated = await tx.tierSequence.update({
          where: {
            prefix_month_year: {
              prefix,
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

      return `${prefix}-${formattedMonth}-${year}-${formattedCounter}`;
    });
  }
// Crée un nouveau tier avec un ID généré automatiquement
  async create(data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    role: TierRole;
  }) {
    const id = await this.generateTierId(data.role);

    return this.prisma.tier.create({
      data: {
        id,
        ...data,
      },
    });
  }
// Récupère tous les tiers
  findAll() {
    return this.prisma.tier.findMany();
  }
// Récupère un tier spécifique par ID
  findOne(id: string) {
    return this.prisma.tier.findUnique({
      where: { id },
    });
  }
// Met à jour un tier existant
update(id: string, data: Prisma.TierUpdateInput) {
  return this.prisma.tier.update({
    where: { id },
    data,
  });
}
// Supprime un tier par ID
  remove(id: string) {
    return this.prisma.tier.delete({
      where: { id },
    });
  }
}