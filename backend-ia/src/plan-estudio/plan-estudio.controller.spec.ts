import { Test, TestingModule } from '@nestjs/testing';
import { PlanEstudioController } from './plan-estudio.controller';

describe('PlanEstudioController', () => {
  let controller: PlanEstudioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanEstudioController],
    }).compile();

    controller = module.get<PlanEstudioController>(PlanEstudioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
