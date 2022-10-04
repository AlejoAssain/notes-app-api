import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";


export class UpdateUserPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  readonly password: string;
}
