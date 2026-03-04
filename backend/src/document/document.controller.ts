import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import {
  DocumentType,
  Currency,
  DevisStatus,
  FactureStatus,
} from '@prisma/client';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

// Endpoint pour créer un nouveau document
  @Post()
  create(
    @Body()
    dto: {
      type: DocumentType;
      tierId: string;
      currency: Currency;
      tva: string | number;
      dueDate?: Date;
    },
  ) {
    return this.documentService.create(dto);
  }

 // Endpoint pour récupérer tous les documents
  @Get()
  findAll() {
    return this.documentService.findAll();
  }

// Endpoint pour récupérer un document par son ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

 // Endpoint pour mettre à jour un document existant
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    dto: {
      dueDate?: Date;
      tva?: string | number;
      currency?: Currency;
      devisStatus?: DevisStatus;
      factureStatus?: FactureStatus;
    },
  ) {
    return this.documentService.update(id, dto);
  }
// Endpoint pour supprimer un document par son ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(id);
  }
}