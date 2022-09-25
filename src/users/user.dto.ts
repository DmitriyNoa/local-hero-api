import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

class UserDTO {
  @ApiPropertyOptional()
  @IsEmail()
  @MaxLength(100)
  public email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  public radius: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public avatar: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public latitude: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public longitude: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public username: string;
}

export default UserDTO;
