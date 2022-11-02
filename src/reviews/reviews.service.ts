import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ReviewEntity from './review.entity';
import ReviewDto from './review.dto';
import { UsersService } from '../users/users.service';
import {
  AuthenticatedRequest,
  AuthenticationGuard,
} from '../auth/jwt-auth.guard';

@UseGuards(AuthenticationGuard)
@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity) private repo: Repository<ReviewEntity>,
    private userService: UsersService,
  ) {}

  async createReview(reviewDto: ReviewDto, request: AuthenticatedRequest) {
    const reviewerId = request.user.id;
    const reviewer = await this.userService.findOneOrFail(reviewerId);
    const user = await this.userService.findOne({
      where: { id: reviewDto.userId },
    });

    const review = new ReviewEntity();
    review.user = user;
    review.reviewer = reviewer;
    review.text = reviewDto.text;
    review.title = reviewDto.title;
    review.rating = reviewDto.rating;

    const createdReview = await this.repo.save(review);

    return createdReview;
  }

  async getUserReviews(useId: string) {
    const user = await this.userService.findOne({
      where: { id: useId },
    });

    const reviews = await this.repo.find({
      where: { user },
      relations: ['user', 'reviewer'],
      order: { createdAt: 'DESC' },
    });

    const heroUserIDs = reviews.map((review) => review.reviewer.userId);
    const reviewers = await this.userService.getKCUsersByIDs(heroUserIDs);

    const total = reviews.reduce((sum, current) => sum + current.rating, 0);

    const result = reviews.map((review) => {
      const reviewUer = reviewers.find(
        (user) => user.userId === review.reviewer.userId,
      );

      return {
        ...review,
        reviewerUserData: {
          firstName: reviewUer.firstName,
          lastName: reviewUer.lastName,
        },
      };
    });

    return {
      averageRating: reviews.length > 0 ? total / reviews.length : 0,
      reviews: result,
    };
  }

  async getReviewerUserReviews(useId: string) {
    const reviewer = await this.userService.findOne({
      where: { id: useId },
    });

    const reviews = await this.repo.find({
      where: { reviewer },
      relations: ['user', 'reviewer'],
      order: { createdAt: 'DESC' },
    });

    const total = reviews.reduce((sum, current) => sum + current.rating, 0);

    return {
      averageRating: reviews.length > 0 ? total / reviews.length : 0,
      reviews,
    };
  }
}
