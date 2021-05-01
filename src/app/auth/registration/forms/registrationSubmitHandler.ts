import { FormGroup } from "@angular/forms";
import { ClientTypes, RegistrationRequest } from "@typedefs/backend";
import { RawFormData } from "./FormKeys";
import { environment } from "@environments/environment";
import * as dayjs from "dayjs";
import { getAuthToken, getStoredProfileInfo, updateStoredProfile } from "@services/auth/authStore";
import { getUserData } from "@services/user/usersDataSource";
import { ensureResponseIsSuccessful } from "@services/common";

export async function submitRegistrationForms(
  userIdOverride: string,
  isEditingProfile: boolean,
  adminModeEnabled: boolean,
  ...forms: FormGroup[]
): Promise<void> {
  const rawFormData: RawFormData = forms.reduce((data, form) => Object.assign(data, form.value), {});
  const birthdayValue = dayjs(rawFormData.birthDate).format("YYYY-MM-DD");
  
  const registrationPayload: RegistrationRequest = {
    birthday: birthdayValue,
    country_id: rawFormData.country as string,
    state_id: rawFormData.state as string,
    city_id: rawFormData.city as string,
    civil_status_id: rawFormData.maritalStatus as string,
    client: "persona natural",
    client_type: rawFormData.referralSource as ClientTypes,
    education_level_id: rawFormData.educationLevel as string,
    email: rawFormData.emailAddress as string,
    first_name_two: rawFormData.lastName as string,
    first_names: rawFormData.name as string,
    gender_id: parseInt(rawFormData.gender as string),
    last_names: rawFormData.lastName as string,
    last_names_two: rawFormData.lastNameTwo as string,
    password: rawFormData.password as string,
    password_confirmation: rawFormData.passwordConfirmation as string,
    phone: rawFormData.phoneNumber as string,
    userProfile: rawFormData.userProfile as string,
    reference: rawFormData.referralHierarchy1 as string,
    client_config: {
      client_type: rawFormData.referralSource as ClientTypes,
      client: rawFormData.referralHierarchy1 as string,
      selectA: rawFormData.referralHierarchy2 as string,
      selectB: rawFormData.referralHierarchy3 as string,
      selectC: rawFormData.referralHierarchy4 as string,
      selectD: rawFormData.referralHierarchy5 as string
    }
  };

  if (rawFormData.passwordChangeRequested) {
    registrationPayload.current_password = rawFormData.currentPassword as string;
    registrationPayload.password_update_requested = rawFormData.passwordChangeRequested;
  }

  let url = `${environment.url}/api/v1/register`;
  let method = "POST";
  let headers: { [key: string]: string } = {
    "Content-Type": "application/json"
  };

  if (isEditingProfile) {
    const currentProfile = userIdOverride ? {id: userIdOverride} : getStoredProfileInfo();
    url = `${environment.url}/api/v1/users/${currentProfile.id}`;
    method = "PUT";
    headers = {
      ...headers,
      "Authorization": `Bearer ${getAuthToken()}`
    };
  }

  await ensureResponseIsSuccessful(
    fetch(url, {
    body: JSON.stringify(registrationPayload),
    method,
    headers
  }));

  if (isEditingProfile && !adminModeEnabled) {
    const currentProfile = getStoredProfileInfo();
    const profileResult = await getUserData(currentProfile.id);
    updateStoredProfile(profileResult);
  }
}