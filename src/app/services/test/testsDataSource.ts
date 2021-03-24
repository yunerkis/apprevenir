import { Test, TestResult } from "@typedefs/backend";
import { environment } from "@environments/environment";
import { ensureResponseIsSuccessful, getAuthHeaders } from "@services/common";

export function getAllTests(): Promise<Test[]> {
  return ensureResponseIsSuccessful<Test[]>(fetch(`${environment.url}/api/v1/tests`, {
    headers: getAuthHeaders()
  }));
}

export function getAllTestResults(): Promise<TestResult[]> {
  return ensureResponseIsSuccessful<TestResult[]>(fetch(`${environment.url}/api/v1/results/all`, {
    headers: getAuthHeaders()
  }));
}

export function getEnabledTestIdsForClient(clientId: number): Promise<number[]> {
  return ensureResponseIsSuccessful<number[]>(fetch(`${environment.url}/api/v1/clients/${clientId}/enabled_tests`, {
    headers: getAuthHeaders()
  }));
}

export async function setEnabledTestIdsForClient(clientId: number, enabledTestIds: number[]): Promise<void> {
  await ensureResponseIsSuccessful<number[]>(fetch(`${environment.url}/api/v1/clients/${clientId}/enabled_tests`, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json"
    },
    method: "PUT",
    body: JSON.stringify({
      test_ids: enabledTestIds
    })
  }));
}