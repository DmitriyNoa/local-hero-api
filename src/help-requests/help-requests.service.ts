import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import HelpRequestEntity from './help-request.entity';
import HelpRequestDTO from './help-request.dto';
import { Point } from 'geojson';
import { CrudRequest } from '@nestjsx/crud';
import { CategoriesService } from '../categories/categories.service';
import { LanguagesService } from '../languages/languages.service';

interface Hero {
  name: string;
  categories: string[];
  location: Coordinates;
  radius: number;
}

const heroes: Hero[] = [
  //{location: {lat: "52.50796806801554", lng: "13.417890450827027"}, radius: 2000, name: "Joe Anderseen", categories: ["auto", "mechanic"]},
  //{location: {lat: "52.52249803446815", lng: "13.388516252202493"}, radius: 3000, name: "Moe Robinson", categories: ["auto", "mechanic"]},
  //{location: {lat: "52.53234126769997", lng: "13.470748300223583"}, radius: 3000, name: "Steve Rojers", categories: ["auto", "mechanic"]},
  {
    location: { lat: '52.50218186354066', lng: '13.45096285498009' },
    radius: 3000,
    name: 'Amalie Johnson',
    categories: ['auto', 'mechanic'],
  },
];

export interface Coordinates {
  lat: string | null;
  lng: string | number;
}

export interface CrudUserRequest extends CrudRequest {
  user: { id: string; username: string };
}

function calcCrow(coords1, coords2) {
  // var R = 6.371; // km
  const R = 6371000;
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function isNear(distance, radius) {
  return distance <= radius;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}

@Injectable()
export class HelpRequestsService extends TypeOrmCrudService<HelpRequestEntity> {
  constructor(
    @InjectRepository(HelpRequestEntity) repo: Repository<HelpRequestEntity>,
    private userService: UsersService,
    private categoriesService: CategoriesService,
    private languagesService: LanguagesService,
  ) {
    super(repo);
  }

  async findHero(helpRequest: Coordinates) {
    const users = await this.userService.getClosestHeroes(helpRequest);

    return users;
  }

  async getUserRequests(username: string) {
    const user = await this.userService.findUserProfile(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.find({
      where: { requestUser: user },
      relations: ['categories', 'languages', 'requestUser', 'heroHelpRequests'],
    });
  }

  async createHelpRequest(
    helpRequestDto: HelpRequestDTO,
    userId: string,
  ): Promise<HelpRequestEntity> {
    const user = await this.userService.findOneOrFail(userId);

    const newHelpRequest = new HelpRequestEntity();

    newHelpRequest.requestUser = user;
    newHelpRequest.dateType = helpRequestDto.dateType;
    newHelpRequest.description = helpRequestDto.description;
    newHelpRequest.type = helpRequestDto.type;
    newHelpRequest.title = helpRequestDto.title;

    if (helpRequestDto.dateType === 'date') {
      newHelpRequest.activeAt = new Date(newHelpRequest.activeAt);
    }

    if (helpRequestDto.latitude && helpRequestDto.longitude) {
      const pointObject: Point = {
        type: 'Point',
        coordinates: [helpRequestDto.longitude, helpRequestDto.latitude],
      };

      newHelpRequest.location = pointObject;
    }

    if (helpRequestDto.categories && helpRequestDto.categories.length > 0) {
      const categories = await this.categoriesService.findByIds(
        helpRequestDto.categories,
      );

      if (categories && categories.length) {
        newHelpRequest.categories = categories;
      }
    }

    if (helpRequestDto.languages && helpRequestDto.languages.length > 0) {
      const languages = await this.languagesService.findByIds(
        helpRequestDto.languages,
      );

      if (languages && languages.length > 0) {
        newHelpRequest.languages = languages;
      }
    }

    // If hero location is provided create geometry object and save location
    if (helpRequestDto.location) {
      const pointObject: Point = {
        type: 'Point',
        coordinates: [
          helpRequestDto.location.details.geometry.location.lng,
          helpRequestDto.location.details.geometry.location.lat,
        ],
      };

      newHelpRequest.location = pointObject;
      newHelpRequest.locationMeta = helpRequestDto.location.data.description;
    }

    const saved = this.repo.save(newHelpRequest);

    return saved;
  }

  async getRequestByIdOrFail(id: string) {
    const helpRequest = await this.repo.findOne({
      where: { id },
      relations: ['requestUser'],
    });

    if (!helpRequest) {
      throw new NotFoundException('Help request not found');
    }

    return helpRequest;
  }
}
