import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Hero, UsersService } from './users.service';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';

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
    console.log("Searching user");
    return await this.usersService.findOne(username);
  }

  @Post()
  addUser(@Body() hero: Hero) {
    return this.usersService.addUser(hero);
  }

  @Delete()
  removeHero(@Param('id') id: string) {
    return this.usersService.removeHero(id);
  }
}
