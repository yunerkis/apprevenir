import { ClientTypes } from "./ClientTypes";
import { UserProfile } from "./UserProfile";

export interface User<TClientType extends ClientTypes = ClientTypes.NaturalPerson> {
  id: number,
  reference: any,
  email: string,
  email_verified_at: string,
  client: TClientType,
  status: number,
  system: string | null,
  created_at: string,
  updated_at: string,
  deleted_at: string | null,
  profile: UserProfile
}