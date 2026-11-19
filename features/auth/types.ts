import type { LoginFormValues } from "./validation/authSchemas";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthState {
  id?: number;
  username?: string;
  email?: string;
  isLoggedIn: boolean;
}

export type LoginPayload = LoginFormValues;

export interface LoginResponse {
  message?: string;
  user?: AuthUser;
  errors?: Partial<Record<keyof LoginFormValues, string[]>>;
}

export interface SignupResponse {
  message?: string;
  user?: AuthUser & { createdAt?: string };
  errors?: Record<string, string[] | undefined>;
}