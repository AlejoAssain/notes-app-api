import { IsOptional, IsString } from "class-validator";


export class UpdateUserDataDto {
  @IsString()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly username: string;

  @IsString()
  @IsOptional()
  readonly name: string;
}
