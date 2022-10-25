import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  AuthenticatedRequest,
  AuthenticationGuard,
} from '../auth/jwt-auth.guard';
import { ReviewsService } from './reviews.service';
import ReviewDTO from './review.dto';

@UseGuards(AuthenticationGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(public service: ReviewsService) {}

  @Post()
  createOne(@Req() request: AuthenticatedRequest, @Body() review: ReviewDTO) {
    return this.service.createReview(review, request);
  }
}
