import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AuthenticatedRequest,
  AuthenticationGuard,
} from '../auth/jwt-auth.guard';
import { CrudRequest, ParsedRequest } from '@nestjsx/crud';
import HeroEntity from './hero.entity';
import { HeroesService } from './heroes.service';
import HeroDTO from './hero.dto';
import { HeroesHelpRequestService } from './heroes-help-request.service';
import { ChatService } from '../chat/chat.service';
import { HelpRequestsService } from '../help-requests/help-requests.service';
import { ReviewsService } from '../reviews/reviews.service';

@UseGuards(AuthenticationGuard)
@Controller('/heroes')
export class HeroesController {
  constructor(
    public service: HeroesService,
    public chatService: ChatService,
    public heroHelpRequestService: HeroesHelpRequestService,
    public helpRequestsService: HelpRequestsService,
    private reviewsService: ReviewsService,
  ) {}

  @Get('/:heroId')
  getHero(@Param('heroId') heroId: string): Promise<HeroEntity> {
    return this.service.getHero(heroId);
  }

  @Post()
  createOne(
    @Body() heroDTO: HeroDTO,
    @ParsedRequest() crudRequest: CrudRequest,
    @Req() request: AuthenticatedRequest,
  ): Promise<HeroEntity> {
    return this.service.createHero(heroDTO, request);
  }

  @Post('/:heroId/help-requests')
  requestHeroHelp(
    @Body() { helpRequestId }: { helpRequestId: string },
    @Param('heroId') heroId: string,
  ): Promise<any> {
    return this.heroHelpRequestService.requestHeroHelp(heroId, helpRequestId);
  }

  @Get('/:heroId/help-requests')
  getHeroHelpRequests(@Param('heroId') heroId: string): Promise<any> {
    return this.heroHelpRequestService.getHeroHelpRequests(heroId);
  }

  @Get('/:heroId/reviews')
  async getHeroReviews(@Param('heroId') heroId: string): Promise<any> {
    const hero = await this.service.getHero(heroId);

    return this.reviewsService.getUserReviews(hero.user.id);
  }

  @Patch('/:heroId/help-requests/:helpRequestId')
  async updateHeroHelp(
    @Body() { status }: { status: 'pending' | 'rejected' | 'accepted' },
    @Param('heroId') heroId: string,
    @Param('helpRequestId') helpRequestId: string,
  ): Promise<any> {
    // set status of hero help request response
    const helpRequest = await this.helpRequestsService.getRequestByIdOrFail(
      helpRequestId,
    );

    const updated = await this.heroHelpRequestService.updateHeroHelp(
      helpRequest,
      status,
    );

    if (status === 'accepted') {
      const hero = await this.service.getHero(heroId);

      await this.chatService.createHelpRequestChat(
        [hero.user, helpRequest.requestUser],
        helpRequest,
      );
    }

    return updated;
  }
}
