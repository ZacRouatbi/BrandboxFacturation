import { Module } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { DesignationController } from './designation.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:     [PrismaModule],
  controllers: [DesignationController],
  providers:   [DesignationService],
  exports:     [DesignationService],   // ← required so DocumentModule can inject it
})
export class DesignationModule {}