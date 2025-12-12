import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumenService } from './resumen.service';

@Controller('resumen')
export class ResumenController {
  constructor(private readonly resumenService: ResumenService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async generarResumen(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { nivel?: string },
  ) {
    return this.resumenService.generarResumenDesdeArchivo(
      file,
      body.nivel,
    );
  }
}
