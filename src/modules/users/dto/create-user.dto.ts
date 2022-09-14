import { IsString } from "class-validator";


export class CreateUserDto {
  @IsString()
  readonly mail: string;

  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly name: string;
}
