import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class ReviewDTO {
  @ApiProperty()
  @IsNumber()
  public rating: number;

  @ApiProperty()
  @IsString()
  @MaxLength(250)
  @MinLength(50)
  public text: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @MinLength(50)
  public title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public parentId: string;
}

export default ReviewDTO;
