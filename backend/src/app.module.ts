import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { TiersModule } from './tiers/tiers.module'
import { DesignationModule } from './designation/designation.module'
import { DocumentModule } from './document/document.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core'
import { AppService } from './app.service'

@Module({
  imports: [
    ThrottlerModule.forRoot({
  throttlers: [
    {
      ttl: 60000,
      limit: 10,
    },
  ],
}),
    TiersModule,
    DesignationModule,
    DocumentModule,
    PrismaModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, // 👈 ADD THIS
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
 
})
export class AppModule {}