import { ClientTypes } from "../userData/ClientTypes";

export interface ClientRegistrationRequest {
  client: ClientTypes,
  first_names: string,
  password: string,
  password_confirmation: string,
  phone: string,
  email: string,
  status: number,
  country_id: number,
  state_id: number,
  city_id: number,
  client_config: {
    national_id: string,
    brand_color: string
  }
}