import { Injectable } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';
import { AiService } from '../ai/ai.service';
import { ContenidoService } from '../contenido/contenido.service';

@Injectable()
export class ResumenService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly aiService: AiService,
    private readonly contenidoService: ContenidoService, 
  ) {}

 async generarResumenDesdeArchivo(
  file: Express.Multer.File,
  nivel: string = 'medio',
) {
  const textoExtraido = await this.uploadService.processFile(file);

  if (!textoExtraido.texto || textoExtraido.texto.trim().length === 0) {
    return {
      error: true,
      mensaje: 'No se pudo extraer texto del archivo.',
    };
  }

  this.contenidoService.setTexto(textoExtraido.texto);
  const resumen = await this.aiService.generarResumen(
    textoExtraido.texto,   // ✔ ahora sí correcto
    nivel,
  );

  return {
    tipoArchivo: textoExtraido.tipo,
    nivel,
    resumen: resumen.resumen,
  };
}

}
