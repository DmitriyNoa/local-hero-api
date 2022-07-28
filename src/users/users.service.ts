import { Injectable } from '@nestjs/common';
import { Coordinates } from '../help-requests/help-requests.service';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserEntity from './user.entity';

export interface User {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  rank: number;
  avatar: string;
  status: 1 | 0;
  settings: any;
  type: string;
}

export interface Hero extends User {
  radius: number;
  categories: string[];
  longitude: string;
  latitude: string;
}

@Injectable()
export class UsersService {
  private heroes: Hero[] = [];

  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async addHero(hero: Hero) {
    const heroCreated = await this.repository.create(hero);
    await this.repository.save(heroCreated);
    return heroCreated;
  }

  removeHero(id: string) {
    this.heroes = this.heroes.filter((hero) => hero.id !== id);
  }

  getHeroes() {
    return this.repository.find();
  }
}
