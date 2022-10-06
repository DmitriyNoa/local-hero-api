import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import HelpRequestEntity from '../help-requests/help-request.entity';
import HeroEntity from '../heroes/hero.entity';
import CategoryEntity from './category.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    TypeOrmModule.forFeature([HelpRequestEntity, HeroEntity, CategoryEntity]),
    AuthModule,
  ],
})
export class CategoriesModule {}
