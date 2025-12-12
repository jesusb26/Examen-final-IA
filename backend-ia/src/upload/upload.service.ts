import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
const pdf = require('pdf-parse');  // ✔ versión 1.1.1
import Tesseract from 'tesseract.js';

@Injectable()
export class UploadService {
  async processFile(file: Express.Multer.File) {
    const mime = file.mimetype;

    // --- PDF ---
    if (mime === 'application/pdf') {
      const data = await pdf(file.buffer); // <--- AQUÍ EL CAMBIO
      return {
        tipo: 'pdf',
        texto: data.text ?? '',
      };
    }

    // --- IMAGEN ---
    if (mime.startsWith('image/')) {
      const result = await Tesseract.recognize(file.buffer, 'eng'); // <--- AQUÍ TAMBIÉN
      return {
        tipo: 'imagen',
        texto: result.data?.text ?? '',
      };
    }

    return {
      tipo: 'desconocido',
      texto: '',
      mensaje: 'Formato no soportado aún.',
    };
  }
}

