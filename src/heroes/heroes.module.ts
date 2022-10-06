import { Module } from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { HeroesController } from './heroes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import HelpRequestEntity from '../help-requests/help-request.entity';
import LanguageEntity from '../languages/language.entity';
import CategoryEntity from '../categories/category.entity';
import UserEntity from '../users/user.entity';

@Module({
  providers: [HeroesService],
  controllers: [HeroesController],
  imports: [
    TypeOrmModule.forFeature([
      HelpRequestEntity,
      CategoryEntity,
      LanguageEntity,
      UserEntity,
    ]),
  ],
})
export class HeroesModule {}
