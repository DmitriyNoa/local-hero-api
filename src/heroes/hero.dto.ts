import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export interface Location {
  lat: string;
  lng: string;
}

export interface LocationData {
  data: {
    description: string;
  };
  details: {
    geometry: {
      location: Location;
      viewport: {
        northeast: Location;
        southwest: Location;
      };
    };
  };
}

class HeroDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public latitude: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public longitude: string;

  @ApiPropertyOptional()
  @IsArray()
  @MaxLength(10)
  @MinLength(3)
  public categories: string[];

  @ApiPropertyOptional()
  @MaxLength(10)
  @MinLength(3)
  public languages: string[];

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(250)
  @MinLength(50)
  public description: string;

  @ApiPropertyOptional()
  @IsString()
  public locationDetails: string;

  @ApiPropertyOptional()
  @IsNumber()
  public radius: string;

  @ApiPropertyOptional()
  public location: LocationData;
}

export default HeroDTO;
