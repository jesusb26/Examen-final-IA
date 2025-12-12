// src/contenido/contenido.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContenidoService {
  private texto: string = '';

  setTexto(texto: string) {
    this.texto = texto;
  }

  getTexto() {
    return this.texto;
  }

  limpiar() {
    this.texto = '';
  }
}
