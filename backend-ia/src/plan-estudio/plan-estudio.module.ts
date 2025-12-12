// src/plan-estudio/plan-estudio.module.ts
import { Module } from '@nestjs/common';
import { PlanEstudioController } from './plan-estudio.controller';
import { PlanEstudioService } from './plan-estudio.service';
import { AiModule } from '../ai/ai.module';
import { ContenidoModule } from '../contenido/contenido.modelo';

@Module({
  imports: [AiModule, ContenidoModule],
  controllers: [PlanEstudioController],
  providers: [PlanEstudioService],
})
export class PlanEstudioModule {}
