"use client";

export const ACCESS_TOKEN_KEY =
  "phonebhai-access-token";

export const USER_KEY =
  "phonebhai-user";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role?: string;
};

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    ACCESS_TOKEN_KEY,
  );
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
}

export function saveAuth(
  token: string,
  user: AuthUser,
) {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    token,
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user),
  );
}

export function clearAuth() {
  localStorage.removeItem(
    ACCESS_TOKEN_KEY,
  );

  localStorage.removeItem(USER_KEY);
}