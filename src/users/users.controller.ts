import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Hero, UsersService } from './users.service';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';
import UserDTO from './user.dto';
import { HelpRequestsService } from '../help-requests/help-requests.service';
import { ChatService } from '../chat/chat.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private helpRequests: HelpRequestsService,
    private chatService: ChatService,
  ) {}

  @Get()
  async getHeroes() {
    return await this.usersService.getHeroes();
  }

  @Get('/:username')
  @UseGuards(AuthenticationGuard)
  async getOne(@Param('username') username: string) {
    return await this.usersService.findUser(username);
  }

  @Get('/:username/help-requests')
  @UseGuards(AuthenticationGuard)
  async getUserRequests(@Param('username') username: string) {
    return await this.helpRequests.getUserRequests(username);
  }

  @Get('/:username/chats')
  @UseGuards(AuthenticationGuard)
  async getUserChats(
    @Param('username') username: string,
    @Req() request: any,
  ) {
    return await this.chatService.getUserChats(username);
  }

  @Post()
  addUser(@Body() hero: Hero) {
    return this.usersService.addUser(hero);
  }

  @Put('/:username')
  @UseGuards(AuthenticationGuard)
  updateUser(
    @Body() user: Partial<UserDTO>,
    @Req() request: any,
    @Param('username') username: string,
  ) {
    const { id } = request.user;
    return this.usersService.updateUser(id, user);
  }

  @Delete()
  removeHero(@Param('id') id: string) {
    return this.usersService.removeHero(id);
  }
}
