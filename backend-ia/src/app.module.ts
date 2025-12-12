import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UploadModule } from './upload/upload.module';
import { AiModule } from './ai/ai.module';
import { ResumenModule } from './resumen/resumen.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { PlanEstudioModule } from './plan-estudio/plan-estudio.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,      // <<— hace disponible process.env en todo el proyecto
    }),
    UploadModule,
    AiModule,
    ResumenModule,
    FlashcardsModule,
    PlanEstudioModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
