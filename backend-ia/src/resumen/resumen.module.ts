import { Module, forwardRef } from '@nestjs/common';
import { ResumenController } from './resumen.controller';
import { ResumenService } from './resumen.service';
import { UploadModule } from '../upload/upload.module';
import { AiModule } from '../ai/ai.module';
import { ContenidoService } from 'src/contenido/contenido.service';
import { ContenidoModule } from 'src/contenido/contenido.modelo';

@Module({
  imports: [
    UploadModule, ContenidoModule,
    forwardRef(() => AiModule)   // <-- aquí usamos forwardRef también
  ],
  controllers: [ResumenController],
  providers: [ResumenService],
  exports: [ResumenService],
})
export class ResumenModule {}
