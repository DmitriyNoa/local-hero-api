import { Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import HelpRequestEntity from '../help-requests/help-request.entity';
import HeroEntity from '../heroes/hero.entity';
import LanguageEntity from './language.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [LanguagesService],
  controllers: [LanguagesController],
  imports: [
    TypeOrmModule.forFeature([HelpRequestEntity, HeroEntity, LanguageEntity]),
    AuthModule,
  ],
})
export class LanguagesModule {}
