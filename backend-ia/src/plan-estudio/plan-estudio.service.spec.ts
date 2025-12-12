import { Test, TestingModule } from '@nestjs/testing';
import { PlanEstudioService } from './plan-estudio.service';

describe('PlanEstudioService', () => {
  let service: PlanEstudioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanEstudioService],
    }).compile();

    service = module.get<PlanEstudioService>(PlanEstudioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
