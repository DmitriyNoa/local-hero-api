import { forwardRef, Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import ReviewEntity from './review.entity';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [ReviewsService],
  controllers: [ReviewsController],
  imports: [
    TypeOrmModule.forFeature([ReviewEntity]),
    AuthModule,
    forwardRef(() => UsersModule),
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
