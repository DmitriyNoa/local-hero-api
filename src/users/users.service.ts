import { Injectable } from '@nestjs/common';
import { Coordinates } from '../help-requests/help-requests.service';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  location: Coordinates;
  rank: number;
  avatar: string;
  status: 1 | 0;
  settings: any;
}

export interface User {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  location: Coordinates;
  rank: number;
  avatar: string;
  status: 1 | 0;
  settings: any;
}

export interface Hero extends User {
  radius: number;
  categories: string[];
}

@Injectable()
export class UsersService {
  private heroes: Hero[] = [];

  constructor() {
    console.log('Heroes', this.heroes);
  }

  addHero(hero: Hero) {
    hero.id = uuidv4();
    this.heroes.push(hero);

    return hero;
  }

  removeHero(id: string) {
    this.heroes = this.heroes.filter((hero) => hero.id !== id);
  }

  getHeroes() {
    return this.heroes;
  }
}
