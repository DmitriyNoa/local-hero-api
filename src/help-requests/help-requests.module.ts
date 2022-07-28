import { Module } from '@nestjs/common';
import { HelpRequestsController } from './help-requests.controller';
import { HelpRequestsService } from './help-requests.service';
import { HelpRequestsGateway } from './help-requests.gateway';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from '../users/user.entity';

@Module({
  controllers: [HelpRequestsController],
  providers: [HelpRequestsService, HelpRequestsGateway, UsersService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class HelpRequestsModule {}
