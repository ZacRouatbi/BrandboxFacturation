import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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

  // POST /document
  @Post()
  create(
    @Body()
    dto: {
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
        total:       number;
      }[];
    },
  ) {
    return this.documentService.create(dto);
  }

  // GET /document/stats  ← must be before /:id
  @Get('stats')
  getStats() {
    return this.documentService.getStats();
  }

  // GET /document?type=DEVIS&page=1&limit=10&...
  @Get()
  findAll(
    @Query('page')         page?:         string,
    @Query('limit')        limit?:        string,
    @Query('type')         type?:         DocumentType,
    @Query('dateFrom')     dateFrom?:     string,
    @Query('dateTo')       dateTo?:       string,
    @Query('dueDateFrom')  dueDateFrom?:  string,
    @Query('dueDateTo')    dueDateTo?:    string,
  ) {
    return this.documentService.findAll(
      page  ? parseInt(page)  : 1,
      limit ? parseInt(limit) : 10,
      type,
      dateFrom,
      dateTo,
      dueDateFrom,
      dueDateTo,
    );
  }

  // GET /document/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  // PATCH /document/:id
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    dto: {
      dueDate?:       string | Date | null;
      tva?:           string | number;
      currency?:      Currency;
      devisStatus?:   DevisStatus;
      factureStatus?: FactureStatus;
    },
  ) {
    return this.documentService.update(id, dto);
  }

  // POST /document/:id/convert
  @Post(':id/convert')
  convertToFacture(@Param('id') id: string) {
    return this.documentService.convertToFacture(id);
  }

  // DELETE /document/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(id);
  }
}