import { IsOptional } from 'class-validator';

import { FilteredUser } from 'src/modules/users/dto';


export class FilteredProject {
  id: number;

  name: string;

  description: string;

  ownerId: number;

  @IsOptional()
  participants?: FilteredUser[]
}
