import { FilteredUser } from "../../modules/users/dto";

export class AuthResponse {
  user: FilteredUser;
  token: string;
}
