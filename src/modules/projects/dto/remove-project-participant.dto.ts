import { IsString } from "class-validator";


export class RemoveProjectParticipantDto {
  @IsString()
  participantUsername: string;
}
