import { FormGroup } from "@angular/forms";
import { RegistrationSystemRequest} from "@typedefs/backend";
import { RawFormData } from "./FormKeys";
import { environment } from "@environments/environment";
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
  
  const registrationPayload: RegistrationSystemRequest = {
    civil_status_id: rawFormData.maritalStatus as string,
    userProfile: rawFormData.userProfile as string,
    client: "persona natural",
    email: rawFormData.emailAddress as string,
    first_name_two: rawFormData.lastName as string,
    first_names: rawFormData.name as string,
    status: parseInt(rawFormData.status as string),
    last_names: rawFormData.lastName as string,
    last_names_two: rawFormData.lastNameTwo as string,
    password: rawFormData.password as string,
    password_confirmation: rawFormData.passwordConfirmation as string,
    phone: rawFormData.phoneNumber as string,
  };

  let url = `${environment.url}/api/v1/users/systems/create?system=true`;
  let method = "POST";
  let headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getAuthToken()}`
  };

  if (isEditingProfile) {
    const currentProfile = userIdOverride ? {id: userIdOverride} : getStoredProfileInfo();
    url = `${environment.url}/api/v1/users/${currentProfile.id}`;
    method = "PUT";
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