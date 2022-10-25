import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() authRequest) {
    console.log('----login', authRequest);
    return this.authService.login(authRequest);
  }
}
