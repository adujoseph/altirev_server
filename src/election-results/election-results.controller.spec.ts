import { Test, TestingModule } from '@nestjs/testing';
import { ElectionResultsController } from './election-results.controller';

describe('ElectionResultsController', () => {
  let controller: ElectionResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElectionResultsController],
    }).compile();

    controller = module.get<ElectionResultsController>(ElectionResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
