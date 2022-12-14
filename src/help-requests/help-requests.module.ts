import { forwardRef, Module } from '@nestjs/common';
import { HelpRequestsController } from './help-requests.controller';
import { HelpRequestsService } from './help-requests.service';
import { HelpRequestsGateway } from './help-requests.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import HelpRequestEntity from './help-request.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { LanguagesModule } from '../languages/languages.module';
import HelpRequestHeroEntity from './help-request-heroes.entity';

@Module({
  controllers: [HelpRequestsController],
  providers: [HelpRequestsService, HelpRequestsGateway],
  exports: [HelpRequestsService],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      HelpRequestEntity,
      HelpRequestHeroEntity,
    ]),
    forwardRef(() => UsersModule),
    AuthModule,
    CategoriesModule,
    LanguagesModule,
  ],
})
export class HelpRequestsModule {}
