import { forwardRef, Module } from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { HeroesController } from './heroes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import HelpRequestEntity from '../help-requests/help-request.entity';
import LanguageEntity from '../languages/language.entity';
import CategoryEntity from '../categories/category.entity';
import UserEntity from '../users/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import HeroEntity from './hero.entity';
import { LanguagesModule } from '../languages/languages.module';
import { CategoriesModule } from '../categories/categories.module';
import { HeroesSearchController } from './heroes-search.controller';

@Module({
  providers: [HeroesService],
  controllers: [HeroesController, HeroesSearchController],
  imports: [
    TypeOrmModule.forFeature([
      HelpRequestEntity,
      CategoryEntity,
      LanguageEntity,
      UserEntity,
      HeroEntity,
    ]),
    AuthModule,
    forwardRef(() => UsersModule),
    LanguagesModule,
    CategoriesModule,
  ],
})
export class HeroesModule {}
