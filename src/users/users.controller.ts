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

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getHeroes() {
    return await this.usersService.getHeroes();
  }

  @Get('/:username')
  @UseGuards(AuthenticationGuard)
  async getOne(@Param('username') username: string) {
    return await this.usersService.findUser(username);
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
    return this.usersService.updateUser(username, id, user);
  }

  @Delete()
  removeHero(@Param('id') id: string) {
    return this.usersService.removeHero(id);
  }
}
