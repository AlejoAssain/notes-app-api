import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength
} from 'class-validator';

import { LoginAuthDto } from './login-auth.dto';


export class RegisterAuthDto extends PartialType(LoginAuthDto) {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  readonly name: string;
}
