import { BackendResponse } from "@typedefs/backend";
import Swal from "sweetalert2";
import { getAuthToken } from "./auth/authStore";

export function getAuthHeaders() {
  return {
    "Authorization": `Bearer ${getAuthToken()}`
  };
}

type ErrorsDictionary = string | { [key: string]: string[] };

export class BackendError extends Error {
  get errorMessages(): string[] | string {
    if (typeof this.rawErrors === "string") {
      return this.rawErrors;
    }

    return Object.keys(this.rawErrors).map(key => this.rawErrors[key].join(", "));
  }

  constructor(public rawErrors: ErrorsDictionary) {
    super("The server replied negatively to the request");
  }
}

export async function ensureResponseIsSuccessful<TPayload>(requestPromise: ReturnType<typeof fetch>): Promise<TPayload> {
  const result = await requestPromise;
  const response = await result.json() as BackendResponse<TPayload>;
  if (!response.success) {
    throw new BackendError(response.errors);
  }

  return response.data;
}

export async function showErrorMessage(error: any) {
  let errorMessage = "No fue posible contactar el servidor. Por favor revisa tu conexión a internet e inténtalo de nuevo";

  if (error instanceof BackendError) {
    errorMessage = "Por favor revisa los datos ingresados e inténtalo de nuevo.";
    let formattedErrors = "";
    if (typeof error.rawErrors === "string") {
      formattedErrors = `<li>${error.rawErrors}</li>`;
    } else if (Array.isArray(error.rawErrors)) {
      formattedErrors = error.rawErrors.map(error => `<li>${error}</li>`).join(" ");
    }

    if (formattedErrors != "") {
      errorMessage += `<br /> <ul>${formattedErrors}</ul>`;
    }
  }
  
  await Swal.fire("Error", errorMessage, "error");
}