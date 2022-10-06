import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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

  @ApiProperty()
  @IsOptional()
  @IsString()
  public name: string;

  @ApiPropertyOptional()
  @IsNumber()
  public radius: string;
}

export default HeroDTO;
