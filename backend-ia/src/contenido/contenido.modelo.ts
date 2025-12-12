// src/contenido/contenido.module.ts
import { Module } from '@nestjs/common';
import { ContenidoService } from './contenido.service';

@Module({
  providers: [ContenidoService],
  exports: [ContenidoService],
})
export class ContenidoModule {}
