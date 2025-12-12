// src/plan-estudio/plan-estudio.service.ts
import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { ContenidoService } from '../contenido/contenido.service';

@Injectable()
export class PlanEstudioService {
  constructor(
    private readonly aiService: AiService,
    private readonly contenidoService: ContenidoService,
  ) {}

  async generarExamen(cantidad = 20) {
    const texto = this.contenidoService.getTexto();

    if (!texto || texto.trim() === '') {
      return {
        error: true,
        mensaje: 'No hay contenido cargado. Primero sube un archivo.',
      };
    }

    // ❤️ Pedimos al modelo que genere las preguntas tipo test
    const examen = await this.aiService.generarExamenMultipleChoice(texto, cantidad);

    return examen;
  }
}
