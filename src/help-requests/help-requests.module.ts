import { Module } from '@nestjs/common';
import { HelpRequestsController } from './help-requests.controller';
import { HelpRequestsService } from './help-requests.service';
import { HelpRequestsGateway } from './help-requests.gateway';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [HelpRequestsController],
  providers: [HelpRequestsService, HelpRequestsGateway, UsersService]
})
export class HelpRequestsModule {}
