import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { UsersService } from './users.service';
import { S3Service } from '../services/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';
import { ParsedBody } from '@nestjsx/crud';

@Controller('user-media')
export class UsersMediaController {
  constructor(
    private usersService: UsersService,
    private s3Service: S3Service,
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fieldSize: 25 * 1024 * 1024 },
    }),
  )
  uploadUSerMedia(
    @UploadedFile() file: any,
    @Req() request: any,
    @ParsedBody() body: any,
  ) {
    return this.s3Service.uploadFile(file);
  }
}
