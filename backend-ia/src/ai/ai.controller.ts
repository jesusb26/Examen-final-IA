// src/ai/ai.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumenService } from '../resumen/resumen.service';

@Controller('ai')
export class AiController {
  constructor(private readonly resumenService: ResumenService) {}

  @Post('resumen')
  @UseInterceptors(FileInterceptor('file'))
  async generarResumen(
    @UploadedFile() file: Express.Multer.File,
    @Body('nivel') nivel: string = 'medio',
  ) {
    if (!file) {
      return { error: true, mensaje: 'No se recibió ningún archivo' };
    }

    const resultado = await this.resumenService.generarResumenDesdeArchivo(
      file,
      nivel,
    );

    return resultado;
  }
}
