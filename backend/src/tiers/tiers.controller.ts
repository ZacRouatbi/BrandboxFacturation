import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { TierService } from './tiers.service';

@Controller('tier')
export class TierController {
  constructor(private readonly tierService: TierService) {}

  @Post()
  create(@Body() dto: any) {
    return this.tierService.create(dto);
  }

  @Get()
  findAll() {
    return this.tierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tierService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.tierService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tierService.remove(id);
  }
}