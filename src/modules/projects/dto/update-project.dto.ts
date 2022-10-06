import { IsString } from "class-validator";


export class UpdateProjectDto {
  @IsString()
  readonly description: string;
}
