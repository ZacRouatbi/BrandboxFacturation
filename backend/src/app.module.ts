import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TiersModule } from './tiers/tiers.module'
import { DesignationModule } from './designation/designation.module'
import { DocumentModule } from './document/document.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module';


@Module({
  imports: [
    TiersModule,
    DesignationModule,
    DocumentModule,
    PrismaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}