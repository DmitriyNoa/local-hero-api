import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class HelpRequestDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public latitude: string;

  @ApiProperty()
  @IsString()
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public longitude: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public dateType: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(250)
  @MinLength(50)
  public description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public type: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @MaxLength(10)
  @MinLength(3)
  public tags: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @MaxLength(10)
  @MinLength(3)
  public categories: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @MaxLength(10)
  @MinLength(3)
  public languages: string[];
}

export default HelpRequestDTO;
