import { Test, TestingModule } from '@nestjs/testing';
import { ResumenController } from './resumen.controller';

describe('ResumenController', () => {
  let controller: ResumenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumenController],
    }).compile();

    controller = module.get<ResumenController>(ResumenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
