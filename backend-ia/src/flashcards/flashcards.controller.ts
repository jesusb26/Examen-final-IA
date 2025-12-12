// src/flashcards/flashcards.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FlashcardsService } from './flashcards.service';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  // src/flashcards/flashcards.controller.ts

@Post('usar-archivo')
async generarDesdeTextoGuardado(
  @Body('cantidad') cantidad: number = 8
) {
  return this.flashcardsService.generarFlashcardsGuardadas(cantidad);
}

}
