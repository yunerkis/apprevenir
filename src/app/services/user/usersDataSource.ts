import { ClientTypes, User } from "@typedefs/backend";
import { environment } from "@environments/environment";
import { ensureResponseIsSuccessful, getAuthHeaders } from "@services/common";

export function getAllClients(): Promise<User[]> {
  return ensureResponseIsSuccessful<User[]>(fetch(`${environment.url}/api/v1/clients`));
}

export function getClientsOfType(clientType: ClientTypes): Promise<User[]> {
  return ensureResponseIsSuccessful<User[]>(fetch(`${environment.url}/api/v1/clients?client=${clientType}`));
}

export function getUserData(userId: string | number): Promise<User> {
  return ensureResponseIsSuccessful<User>(fetch(`${environment.url}/api/v1/users/${userId}`, {
    headers: getAuthHeaders()
  }));
}

export function getSystemUsers(): Promise<User[]> {
  return ensureResponseIsSuccessful<User[]>(fetch(`${environment.url}/api/v1/users?system=user`, {
    headers: getAuthHeaders()
  }));
}

export function getEndUsers(): Promise<User[]> {
  return ensureResponseIsSuccessful<User[]>(fetch(`${environment.url}/api/v1/users?client=persona natural`, {
    headers: getAuthHeaders()
  }));
}

export function deleteUser(userId: number): Promise<void> {
  return ensureResponseIsSuccessful(fetch(`${environment.url}/api/v1/users/${userId}`, {
    headers: getAuthHeaders(),
    method: "DELETE"
  }));
}