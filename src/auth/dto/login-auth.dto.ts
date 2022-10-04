import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength
} from 'class-validator';


export class LoginAuthDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(4)
  password: string;
}
