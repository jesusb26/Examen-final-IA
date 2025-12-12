import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

type Flashcard = { pregunta: string; respuesta: string };

@Injectable()
export class AiService {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // --------------------------------
  //      GENERAR RESUMEN
  // --------------------------------
  async generarResumen(texto: string, nivel: string = 'medio') {
    const prompt = `
Eres un experto en educación. Resume el siguiente texto según el nivel solicitado.

Niveles:
- corto: 1 párrafo claro con los puntos más importantes
- medio: 2-3 párrafos con explicaciones y detalles clave
- largo: explicación detallada (más de 4 parrafos) con lista de conceptos clave y su explicacion 

Nivel: ${nivel}
Texto a resumir:
"${texto}"
`;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return {
      nivel,
      resumen: completion.choices[0]?.message?.content ?? '',
    };
  }

  // --------------------------------
  //      GENERAR FLASHCARDS
  // --------------------------------
  async generarFlashcards(texto: string, cantidad: number = 8) {
    const prompt = `
Genera ${cantidad} flashcards educativas basadas en el siguiente contenido.

Para cada flashcard sigue este formato JSON estrictamente:

[
  { "pregunta": "texto", "respuesta": "texto" }
]

No incluyas explicaciones extra (solo el JSON).

Aquí está el contenido para estudiar:
"${texto}"
`;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    // 1) Normalizar lo que devuelve OpenAI (string | null | array | object)
    const raw = completion.choices[0]?.message?.content;
    const contenido = this.normalizeOpenAIContent(raw);

    // 2) Intentar convertir a array de flashcards (con fallback si viene con ```json ... ```)
    const flashcards = this.tryParseFlashcards(contenido);

    return {
      cantidad: flashcards.length,
      flashcards,
    };
  }

  // -----------------------------
  //  NORMALIZACIÓN (evita contenido.text)
  // -----------------------------
  private normalizeOpenAIContent(input: unknown): string {
    if (input == null) return '';

    if (typeof input === 'string') return input;

    if (Array.isArray(input)) {
      // ej: [{ type: 'text', text: '...' }, ...]
      return input
        .map((p: any) => (p?.text ?? (typeof p === 'string' ? p : '')))
        .join('\n');
    }

    if (typeof input === 'object') {
      const obj = input as Record<string, any>;
      if (typeof obj.text === 'string') return obj.text;
      return JSON.stringify(obj);
    }

    return String(input);
  }

  // -----------------------------
  //  PARSEO DE FLASHCARDS (con limpieza)
  // -----------------------------
  private tryParseFlashcards(contenido: string): Flashcard[] {
    const cleaned = this.cleanJsonWrapper(contenido);

    const parsed = this.safeJsonParse(cleaned);
    if (!Array.isArray(parsed)) return [];

    return (parsed as any[])
      .filter((it) => it && typeof it === 'object')
      .map((it: any) => ({
        pregunta: String(it.pregunta ?? it.question ?? ''),
        respuesta: String(it.respuesta ?? it.answer ?? ''),
      }))
      .filter((fc) => fc.pregunta.trim().length > 0 && fc.respuesta.trim().length > 0);
  }

  private cleanJsonWrapper(text: string): string {
    // Quita bloques ```json ... ``` o ``` ... ```
    let t = text.trim();

    // elimina encabezados tipo ```json
    t = t.replace(/^```(json)?\s*/i, '').replace(/\s*```$/i, '');

    // si el modelo metió texto extra, intenta extraer el primer array JSON plausible
    const start = t.indexOf('[');
    const end = t.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      return t.slice(start, end + 1);
    }

    return t;
  }

  private safeJsonParse(str: string): any {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  // Examenes de opción múltiple

async generarExamenMultipleChoice(texto: string, cantidad: number) {
  const prompt = `
Genera un examen de ${cantidad} preguntas de selección múltiple (una sola respuesta correcta)
a partir del siguiente contenido:

"${texto}"

Formato JSON EXACTO:
{
  "preguntas": [
    {
      "id": 1,
      "pregunta": "texto...",
      "opciones": ["A", "B", "C", "D"],
      "correcta": "B"
    }
  ]
}

Reglas:
- 4 opciones por pregunta
- La respuesta correcta debe estar en una posición aleatoria
- Opciones plausibles y difíciles
- NO agregues texto afuera del JSON
`;

  const response = await this.client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  // 1. Buscar un mensaje
  const message = response.output.find((item) => item.type === "message");

  if (!message || !("content" in message)) {
    throw new Error("No se encontró contenido de mensaje en la respuesta de OpenAI.");
  }

  // 2. Filtrar solo bloques de tipo output_text
  const textParts = message.content
    .filter((c: any) => c.type === "output_text" && typeof c.text === "string")
    .map((c: any) => c.text);

  if (!textParts.length) {
    throw new Error("OpenAI no devolvió texto válido para el examen.");
  }

  // 3. Unir todo el texto por si son varios bloques
  let jsonString = textParts.join("\n");

  // 4. Limpiar envolturas tipo markdown (```json ... ```)
  jsonString = jsonString.replace(/```json|```/g, "").trim();

  // 5. Extraer solo el bloque JSON si hay texto adicional
  const match = jsonString.match(/\{[\s\S]*\}/);
  if (!match) {
    console.error("Respuesta del modelo:", jsonString);
    throw new Error("No se encontró bloque JSON válido en la respuesta.");
  }

  // 6. Parsear con manejo de errores
  try {
    return JSON.parse(match[0]);
  } catch (error) {
    console.error("Error al parsear JSON generado por el modelo:", jsonString);
    throw new Error("El modelo devolvió un formato inválido. Revisa el prompt o la limpieza.");
  }
}




}
