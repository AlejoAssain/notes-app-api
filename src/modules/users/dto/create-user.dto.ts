import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength
} from "class-validator";


export class CreateUserDto {
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
