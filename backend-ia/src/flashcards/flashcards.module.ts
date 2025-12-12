// src/flashcards/flashcards.module.ts
import { Module } from '@nestjs/common';
import { FlashcardsController } from './flashcards.controller';
import { FlashcardsService } from './flashcards.service';
import { AiModule } from '../ai/ai.module';
import { UploadModule } from '../upload/upload.module';
import { ContenidoModule } from 'src/contenido/contenido.modelo';

@Module({
  imports: [AiModule, UploadModule, ContenidoModule],
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
})
export class FlashcardsModule {}
