import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para el frontend en producción y desarrollo
  app.enableCors({
    origin: [
      'http://localhost:5173', // desarrollo local
      'https://examen-final-ia.vercel.app', // dominio de Vercel en producción
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
