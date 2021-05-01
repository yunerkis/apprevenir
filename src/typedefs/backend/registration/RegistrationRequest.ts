import { UserClientConfig } from "../userData/UserClientConfig";
import { ClientTypes } from "../userData/ClientTypes";

export interface RegistrationRequest {
  birthday: string,
  city_id: string,
  civil_status_id: string,
  client: "persona natural",
  userProfile: string,
  client_config: UserClientConfig,
  client_type: ClientTypes,
  country_id: string,
  education_level_id: string,
  email: string,
  first_name_two: string,
  first_names: string,
  gender_id: number,
  last_names: string,
  last_names_two: string,
  password: string,
  password_confirmation: string,
  phone: string,
  reference: string,
  state_id: string,
  password_update_requested?: boolean,
  current_password?: string
}