import { Module } from '@nestjs/common';
import { HelpRequestsController } from './help-requests.controller';
import { HelpRequestsService } from './help-requests.service';
import { HelpRequestsGateway } from './help-requests.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from '../users/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [HelpRequestsController],
  providers: [HelpRequestsService, HelpRequestsGateway],
  imports: [TypeOrmModule.forFeature([UserEntity]), UsersModule],
})
export class HelpRequestsModule {}
