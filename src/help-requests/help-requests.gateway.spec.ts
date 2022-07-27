import { Test, TestingModule } from '@nestjs/testing';
import { HelpRequestsGateway } from './help-requests.gateway';

describe('HelpRequestsGateway', () => {
  let gateway: HelpRequestsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpRequestsGateway],
    }).compile();

    gateway = module.get<HelpRequestsGateway>(HelpRequestsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
