import axios from "axios";

function getServerMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const data = error.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data === "object") {
    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }

    if ("error" in data && typeof data.error === "string") {
      return data.error;
    }
  }

  return null;
}

export function getLoginErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage = getServerMessage(error)?.toLowerCase();

    if (status === 401) {
      return "Unauthorized: invalid email or password.";
    }

    if (status === 404) {
      return "No account was found for this email.";
    }

    if (status === 423) {
      return "Your account is temporarily locked. Please try again later.";
    }

    if (status === 429) {
      return "Too many login attempts. Please wait a moment and try again.";
    }

    if (serverMessage?.includes("unauthorized")) {
      return "Unauthorized: invalid email or password.";
    }
  }

  return getServerMessage(error) ?? "Unable to log in right now. Please try again.";
}

export function getSignupErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage = getServerMessage(error)?.toLowerCase();

    if (status === 409) {
      return "User already exists. Please log in instead.";
    }

    if (status === 400) {
      if (serverMessage?.includes("already exists")) {
        return "User already exists. Please log in instead.";
      }

      return "Please check your details and try again.";
    }

    if (status === 422) {
      return "Some signup details are invalid. Please review the form and try again.";
    }

    if (status === 429) {
      return "Too many signup attempts. Please wait a moment and try again.";
    }

    if (serverMessage?.includes("already exists")) {
      return "User already exists. Please log in instead.";
    }
  }

  return getServerMessage(error) ?? "Unable to create account right now. Please try again.";
}
