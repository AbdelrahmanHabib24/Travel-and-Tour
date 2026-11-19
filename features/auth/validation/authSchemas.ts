import { z } from "zod";

export interface LoginValidationMessages {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
}

export interface SignupValidationMessages {
  usernameMin: string;
  emailRequired: string;
  emailInvalid: string;
  passwordMin: string;
  passwordUppercase: string;
  passwordNumber: string;
  passwordSpecial: string;
  confirmPasswordRequired: string;
  passwordsDoNotMatch: string;
}

const DEFAULT_LOGIN_MESSAGES: LoginValidationMessages = {
  emailRequired: "Please enter your email address",
  emailInvalid: "This email address is not valid",
  passwordRequired: "Please enter your password",
};

const DEFAULT_SIGNUP_MESSAGES: SignupValidationMessages = {
  usernameMin: "Username must be at least 3 characters long",
  emailRequired: "Please provide a valid email address",
  emailInvalid: "Please provide a valid email address",
  passwordMin: "Password must be at least 8 characters long",
  passwordUppercase: "Password must contain at least one uppercase letter",
  passwordNumber: "Password must contain at least one number",
  passwordSpecial: "Password must include a special character",
  confirmPasswordRequired: "Please confirm your password",
  passwordsDoNotMatch: "Passwords do not match",
};

export const createLoginSchema = (messages: LoginValidationMessages = DEFAULT_LOGIN_MESSAGES) => {
  return z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z
      .string()
      .min(1, messages.passwordRequired),
  });
};

const createSignupSchema = (messages: SignupValidationMessages = DEFAULT_SIGNUP_MESSAGES) => {
  return z.object({
    username: z
      .string()
      .trim()
      .min(3, messages.usernameMin),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z
      .string()
      .min(8, messages.passwordMin)
      .regex(/[A-Z]/, messages.passwordUppercase)
      .regex(/\d/, messages.passwordNumber)
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        messages.passwordSpecial
      ),
  });
};

export const createServerSignupSchema = (messages: SignupValidationMessages = DEFAULT_SIGNUP_MESSAGES) => {
  return createSignupSchema(messages)
    .extend({
      confirmPassword: z
        .string()
        .min(1, messages.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordsDoNotMatch,
      path: ["confirmPassword"],
    });
};

export const loginSchema = createLoginSchema(DEFAULT_LOGIN_MESSAGES);
export const serverSignupSchema = createServerSignupSchema(DEFAULT_SIGNUP_MESSAGES);

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type SignupFormValues = z.infer<ReturnType<typeof createServerSignupSchema>>;
