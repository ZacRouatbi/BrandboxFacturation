import { Module } from '@nestjs/common';
import { TierController } from './tiers.controller';
import { TierService } from './tiers.service';

@Module({
  controllers: [TierController],
  providers: [TierService]
})
export class TiersModule {}
