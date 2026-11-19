import { apiRequest } from "@/lib/http/apiClient";
import type {
  LoginFormValues,
  SignupFormValues,
} from "../validation/authSchemas";
import type { AuthUser, LoginResponse, SignupResponse } from "../types";

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const data = await apiRequest<{ user?: AuthUser | null }>(
      "/api/auth/user",
      { cache: "no-store" }
    );
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export async function login(
  payload: LoginFormValues
): Promise<{ ok: boolean; status: number; data: LoginResponse }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as LoginResponse;
  return { ok: res.ok, status: res.status, data };
}

export async function signup(
  payload: SignupFormValues
): Promise<{ ok: boolean; status: number; data: SignupResponse }> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as SignupResponse;
  return { ok: res.ok, status: res.status, data };
}

export async function logout(): Promise<void> {
  await apiRequest<{ message?: string }>("/api/auth/logout", {
    method: "POST",
  });
}

export const authService = {
  getCurrentUser,
  login,
  signup,
  logout,
};