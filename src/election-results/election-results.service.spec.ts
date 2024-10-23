import { Test, TestingModule } from '@nestjs/testing';
import { ElectionResultsService } from './election-results.service';

describe('ElectionResultsService', () => {
  let service: ElectionResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElectionResultsService],
    }).compile();

    service = module.get<ElectionResultsService>(ElectionResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
