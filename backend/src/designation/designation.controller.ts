import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { DesignationService } from './designation.service';

@Controller('designation')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  // Create a new designation (line item)
  @Post()
  create(
    @Body()
    dto: {
      description: string;
      quantity: string | number;
      unitPrice: string | number;
      documentId: string;
    },
  ) {
    return this.designationService.create(dto);
  }

  // Update a designation
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    dto: {
      description?: string;
      quantity?: string | number;
      unitPrice?: string | number;
    },
  ) {
    return this.designationService.update(id, dto);
  }

  // Delete a designation
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.designationService.remove(id);
  }
}