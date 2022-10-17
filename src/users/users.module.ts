import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './user.entity';
import { AuthService } from '../auth/auth.service';
import { UsersMediaController } from './users-media.controller';
import { S3Service } from '../services/s3.service';
import { HelpRequestsService } from '../help-requests/help-requests.service';
import HelpRequestEntity from '../help-requests/help-request.entity';
import { CategoriesModule } from '../categories/categories.module';
import { LanguagesModule } from '../languages/languages.module';
import { UsersHeroController } from './users-hero.controller';
import { HeroesModule } from '../heroes/heroes.module';

@Module({
  providers: [UsersService, AuthService, S3Service, HelpRequestsService],
  controllers: [UsersController, UsersMediaController, UsersHeroController],
  imports: [
    TypeOrmModule.forFeature([UserEntity, HelpRequestEntity]),
    forwardRef(() => CategoriesModule),
    forwardRef(() => LanguagesModule),
    forwardRef(() => HeroesModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
