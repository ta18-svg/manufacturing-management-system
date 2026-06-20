import { apiClient } from "../../lib/api/client";
import type { CurrentUser, LoginRequest, TokenResponse } from "./types";

export async function login(payload: LoginRequest): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>("/api/auth/login", payload);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/api/auth/logout");
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const response = await apiClient.get<CurrentUser>("/api/auth/me");
  return response.data;
}
