import {
  IsNotEmpty,
  IsString
} from "class-validator";


export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
