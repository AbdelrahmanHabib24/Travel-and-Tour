"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createServerSignupSchema,
  SignupFormValues,
  SignupValidationMessages,
} from "@/features/auth/validation/authSchemas";
import SubmitButton from "@/components/ui/SubmitButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslations } from "next-intl";

type SignupFormData = SignupFormValues;

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const t = useTranslations("signup");

  const validationMessages: SignupValidationMessages = useMemo(
    () => ({
      usernameMin: t("errors.usernameMin"),
      emailRequired: t("errors.emailRequired"),
      emailInvalid: t("errors.emailInvalid"),
      passwordMin: t("errors.passwordMin"),
      passwordUppercase: t("errors.passwordUppercase"),
      passwordNumber: t("errors.passwordNumber"),
      passwordSpecial: t("errors.passwordSpecial"),
      confirmPasswordRequired: t("errors.confirmPasswordRequired"),
      passwordsDoNotMatch: t("errors.passwordsDoNotMatch"),
    }),
    [t]
  );

  const signupValidationSchema = useMemo(
    () => createServerSignupSchema(validationMessages),
    [validationMessages]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupValidationSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const hasErrorsRef = useRef(false);

  useEffect(() => {
    hasErrorsRef.current = Object.keys(errors).length > 0;
  }, [errors]);

  // Re-trigger validation when locale changes so errors update in the active language
  useEffect(() => {
    if (hasErrorsRef.current) {
      void trigger();
    }
  }, [validationMessages, trigger]);

  const inputClass = (hasError?: boolean) =>
    `w-full ps-4 pe-10 py-3 rounded-xl border text-sm ${
      hasError ? "border-red-400" : "border-gray-300"
    } focus:outline-none focus:ring-2 focus:ring-orange-400`;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-lg mx-auto text-start">
      <h2 className="text-2xl font-bold text-center text-orange-600 mb-2">
        {t("title")}
      </h2>
      <p className="text-sm text-gray-500 text-center mb-4">
        {t("subtitle")}
      </p>

      {serverErrors?.general && (
        <p className="mb-4 text-center text-sm text-red-600">
          {serverErrors.general[0] === "Server error."
            ? t("errors.serverError")
            : serverErrors.general[0]}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmitForm)}
        noValidate
        className="space-y-4 sm:space-y-5"
      >
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("nameLabel")}
          </label>
          <input
            type="text"
            {...register("username")}
            className={inputClass(!!errors.username || !!serverErrors?.username)}
            placeholder={t("namePlaceholder")}
          />
          <p className="mt-1 text-xs text-red-600">
            {errors.username?.message ||
              (serverErrors?.username?.[0]?.includes("already exists")
                ? t("errors.usernameExists")
                : serverErrors?.username?.[0])}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("emailLabel")}
          </label>
          <input
            type="email"
            {...register("email")}
            className={inputClass(!!errors.email || !!serverErrors?.email)}
            placeholder={t("emailPlaceholder")}
          />
          <p className="mt-1 text-xs text-red-600">
            {errors.email?.message ||
              (serverErrors?.email?.[0]?.includes("already exists")
                ? t("errors.emailExists")
                : serverErrors?.email?.[0])}
          </p>
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("passwordLabel")}
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={inputClass(!!errors.password || !!serverErrors?.password)}
              placeholder={t("passwordPlaceholder")}
            />
            <span
              className="absolute end-3 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <p className="mt-1 text-xs text-red-600">
            {errors.password?.message || serverErrors?.password?.[0]}
          </p>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("confirmPasswordLabel")}
          </label>
          <div className="relative flex items-center">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={inputClass(
                !!errors.confirmPassword || !!serverErrors?.confirmPassword
              )}
              placeholder={t("confirmPasswordPlaceholder")}
            />
            <span
              className="absolute end-3 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <p className="mt-1 text-xs text-red-600">
            {errors.confirmPassword?.message || serverErrors?.confirmPassword?.[0]}
          </p>
        </div>

        {/* Submit Button */}
        <SubmitButton
          type="submit"
          loading={loading}
          disabled={!isValid || loading}
        >
          {loading ? t("submitting") : t("submit")}
        </SubmitButton>

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link href="/Login" className="text-secondary hover:underline font-medium">
            {t("hasAccount")} {t("loginLink")}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Form;
