import { Body, Controller, Post } from '@nestjs/common';
import { Coordinates, HelpRequestsService } from './help-requests.service';

@Controller('help-requests')
export class HelpRequestsController {
  constructor(private readonly helpService: HelpRequestsService) {}

  @Post()
  findHelp(@Body() helpRequest: Coordinates): any[] {
    return this.helpService.findHero(helpRequest);
  }
}
