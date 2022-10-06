import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() newUserData : RegisterAuthDto) {
    return this.authService.registerUser(newUserData);
  }

  @Post('login')
  loginUser(@Body() loginUserData : LoginAuthDto) {
    return this.authService.loginUser(loginUserData);
  }
}
