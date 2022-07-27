import { Test, TestingModule } from '@nestjs/testing';
import { HelpRequestsService } from './help-requests.service';

describe('HelpRequestsService', () => {
  let service: HelpRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpRequestsService],
    }).compile();

    service = module.get<HelpRequestsService>(HelpRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
