import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';


@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get('')
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('/:id')
  getUser(@Param('id') idParam : number) {
    return this.usersService.getUser(idParam);
  }

  @Post('/')
  createUser(@Body() body : CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Patch('/:id')
  updateUser(@Body() body : UpdateUserDto) {}
}
