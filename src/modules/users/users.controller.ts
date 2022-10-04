import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req
} from '@nestjs/common';

import { UsersService } from './users.service';
import {
  UpdateUserDataDto,
  UpdateUserPasswordDto
} from './dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';


@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getCurrentUser(@Req() request) {
    return this.usersService.getCurrentUser(request.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-data')
  updateUserData(@Body() newUserData: UpdateUserDataDto, @Req() request) {
    return this.usersService.updateUserData(newUserData, request.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-password')
  updateUserPassword(@Body() newPasswordPasswordData: UpdateUserPasswordDto, @Req() request) {
    return this.usersService.updateUserPassword(newPasswordPasswordData, request.user.username)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  deleteUser(@Req() request) {
    return this.usersService.removeUser(request.user.username)
  }
}
