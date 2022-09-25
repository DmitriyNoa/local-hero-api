import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { S3Service } from '../services/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user-media')
export class UsersMediaController {
  constructor(
    private usersService: UsersService,
    private s3Service: S3Service,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadUSerMedia(@UploadedFile() file: any) {
    return this.s3Service.uploadFile(file);
  }
}
