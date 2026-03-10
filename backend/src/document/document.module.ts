import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DesignationModule } from '../designation/designation.module';

@Module({
  imports:     [PrismaModule, DesignationModule],  // ← DesignationModule provides DesignationService
  controllers: [DocumentController],
  providers:   [DocumentService],
})
export class DocumentModule {}