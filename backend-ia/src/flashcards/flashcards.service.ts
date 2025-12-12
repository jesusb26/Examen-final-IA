// src/flashcards/flashcards.service.ts
import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { ContenidoService } from '../contenido/contenido.service';

@Injectable()
export class FlashcardsService {
  constructor(
    private readonly aiService: AiService,
    private readonly contenidoService: ContenidoService
  ) {}

  async generarFlashcardsGuardadas(cantidad = 8) {
    const texto = this.contenidoService.getTexto();

    if (!texto || texto.trim() === '') {
      return {
        error: true,
        mensaje: 'No hay contenido cargado. Primero sube un archivo.',
      };
    }

    return this.aiService.generarFlashcards(texto, cantidad);
  }
}
