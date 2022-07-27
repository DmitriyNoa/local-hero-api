import { Test, TestingModule } from '@nestjs/testing';
import { HelpRequestsController } from './help-requests.controller';

describe('HelpRequestsController', () => {
  let controller: HelpRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelpRequestsController],
    }).compile();

    controller = module.get<HelpRequestsController>(HelpRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
