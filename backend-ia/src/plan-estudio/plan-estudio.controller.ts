// src/plan-estudio/plan-estudio.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PlanEstudioService } from './plan-estudio.service';

@Controller('plan-estudio')
export class PlanEstudioController {
  constructor(private readonly service: PlanEstudioService) {}

  @Post('examen')
  async generarExamen(@Body('cantidad') cantidad: number = 20) {
    return this.service.generarExamen(cantidad);
  }
}
