import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Query as Queryparam,
} from '@nestjs/common';

import { TierService } from './tiers.service';
import { TierRole } from '@prisma/client';


@Controller('tier')
export class TierController {
  constructor(private readonly tierService: TierService) {}

  @Post()
  create(@Body() dto: any) {
    return this.tierService.create(dto);
  }
  
@Get()
findAll(
  @Queryparam('page')  page:  string,
  @Queryparam('limit') limit: string,
  @Queryparam('role')  role:  TierRole,
) {
  return this.tierService.findAll(
    page  ? parseInt(page)  : 1,
    limit ? parseInt(limit) : 10,
    role  ?? undefined,
  );
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
