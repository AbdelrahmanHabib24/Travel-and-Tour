"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverSignupSchema } from "@/app/ulits/zod"; // ✅ نفس الـ schema اللي عاملها
import { z } from "zod";
import SubmitButton from "./SubmitButton";

type SignupFormData = z.infer<typeof serverSignupSchema>;

interface FormProps {
  onSubmitForm: (data: SignupFormData) => void | Promise<void>;
  loading: boolean;
  serverErrors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string[];
  };
}

const Form: React.FC<FormProps> = ({ onSubmitForm, loading, serverErrors }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(serverSignupSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-3 rounded-xl border ${
      hasError ? "border-red-400" : "border-gray-300"
    } focus:outline-none focus:ring-2 focus:ring-orange-400`;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-center text-orange-600">
        Create Account
      </h2>
      <p className="text-sm text-gray-500 text-center mb-4">
        Join us! Please enter your details.
      </p>

      {serverErrors?.general && (
        <p className="mb-4 text-center text-sm text-red-600">
          {serverErrors.general[0]}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmitForm)}
        noValidate
        className="space-y-5"
      >
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            {...register("username")}
            className={inputClass(
              !!errors.username || !!serverErrors?.username
            )}
            placeholder="your.username"
          />
          <p className="mt-1 text-xs text-red-600">
            {errors.username?.message || serverErrors?.username?.[0]}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className={inputClass(!!errors.email || !!serverErrors?.email)}
            placeholder="you@example.com"
          />
          <p className="mt-1 text-xs text-red-600">
            {errors.email?.message || serverErrors?.email?.[0]}
          </p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className={inputClass(
              !!errors.password || !!serverErrors?.password
            )}
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-red-600">
            {errors.password?.message || serverErrors?.password?.[0]}
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className={inputClass(
              !!errors.confirmPassword || !!serverErrors?.confirmPassword
            )}
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-red-600">
            {errors.confirmPassword?.message ||
              serverErrors?.confirmPassword?.[0]}
          </p>
        </div>

        {/* Submit Button */}
        <SubmitButton
          type="submit"
          loading={loading}
          disabled={!isValid || loading}
        >
          Sign Up
        </SubmitButton>
      </form>
    </div>
  );
};

export default Form;
