import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './user.entity';
import { AuthService } from '../auth/auth.service';
import { UsersMediaController } from './users-media.controller';
import { S3Service } from '../services/s3.service';

@Module({
  providers: [UsersService, AuthService, S3Service],
  controllers: [UsersController, UsersMediaController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UsersService],
})
export class UsersModule {}
