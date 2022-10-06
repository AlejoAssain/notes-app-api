import { IsString } from "class-validator";


export class AddProjectParticipantDto {
  @IsString()
  participantUsername: string;
}
