import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Hero, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  @Get()
  async getHeroes() {
    return await this.usersService.getHeroes();
  }

  @Post()
  addHero(@Body() hero: Hero) {
    return this.usersService.addHero(hero);
  }

  @Delete()
  removeHero(@Param('id') id: string) {
    return this.usersService.removeHero(id);
  }
}
