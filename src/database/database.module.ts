import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import UserEntity from '../users/user.entity';
import HelpRequestEntity from '../help-requests/help-request.entity';
import CategoryEntity from '../categories/category.entity';
import LanguageEntity from '../languages/language.entity';
import HeroEntity from '../heroes/hero.entity';
import HelpRequestHeroEntity from '../help-requests/help-request-heroes.entity';
import ChatEntity from '../chat/chat.entity';
import MessageEntity from '../chat/message.entity';
import ChatToUsersEntity from '../chat/chat-users.entity';
import ReviewEntity from '../reviews/review.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          entities: [
            UserEntity,
            HelpRequestEntity,
            CategoryEntity,
            LanguageEntity,
            HeroEntity,
            HelpRequestHeroEntity,
            ChatEntity,
            MessageEntity,
            ChatToUsersEntity,
            ReviewEntity,
          ],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
