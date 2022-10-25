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
import { HelpRequestsModule } from '../help-requests/help-requests.module';
import { HeroesHelpRequestService } from './heroes-help-request.service';
import HelpRequestHeroEntity from '../help-requests/help-request-heroes.entity';
import { ChatModule } from '../chat/chat.module';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  providers: [HeroesService, HeroesHelpRequestService],
  controllers: [HeroesController, HeroesSearchController],
  imports: [
    TypeOrmModule.forFeature([
      HelpRequestEntity,
      CategoryEntity,
      LanguageEntity,
      UserEntity,
      HeroEntity,
      HelpRequestHeroEntity,
    ]),
    AuthModule,
    forwardRef(() => UsersModule),
    forwardRef(() => HelpRequestsModule),
    LanguagesModule,
    CategoriesModule,
    forwardRef(() => ChatModule),
    ReviewsModule,
  ],
  exports: [HeroesService, HeroesHelpRequestService],
})
export class HeroesModule {}
