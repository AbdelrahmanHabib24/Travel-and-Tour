"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  createLoginSchema,
  LoginFormValues,
  LoginValidationMessages,
} from "@/features/auth/validation/authSchemas";
import SubmitButton from "@/components/ui/SubmitButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.service";
import type { LoginResponse } from "@/features/auth/types";
import { queryKeys } from "@/lib/query/queryKeys";

type LoginFormData = LoginFormValues;

const LoginForm: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("login");

  const validationMessages: LoginValidationMessages = useMemo(
    () => ({
      emailRequired: t("errors.emailRequired"),
      emailInvalid: t("errors.emailInvalid"),
      passwordRequired: t("errors.passwordRequired"),
    }),
    [t],
  );

  const currentLoginSchema = useMemo(
    () => createLoginSchema(validationMessages),
    [validationMessages],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    clearErrors,
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(currentLoginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const hasErrorsRef = useRef(false);
  useEffect(() => {
    hasErrorsRef.current = Object.keys(errors).length > 0;
  }, [errors]);

  // Re-trigger validation when locale changes so errors update in the active language
  useEffect(() => {
    if (hasErrorsRef.current) {
      trigger();
    }
  }, [validationMessages, trigger]);

  const setServerErrors = (result: LoginResponse) => {
    const fieldErrors = result.errors;

    if (fieldErrors?.email?.[0]) {
      const msg = fieldErrors.email[0];
      const localized = msg.includes("No account")
        ? t("errors.userNotFound")
        : msg;
      setError("email", { type: "server", message: localized });
    }

    if (fieldErrors?.password?.[0]) {
      const msg = fieldErrors.password[0];
      const localized = msg.includes("incorrect")
        ? t("errors.incorrectPassword")
        : msg;
      setError("password", {
        type: "server",
        message: localized,
      });
    }

    if (!fieldErrors?.email?.[0] && !fieldErrors?.password?.[0]) {
      setError("root.server", {
        type: "server",
        message: result.message || t("errors.serverError"),
      });
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    clearErrors("root.server");

    try {
      const { ok, data: result } = await authService.login(data);

      if (!ok) {
        setServerErrors(result);
        return;
      }

      queryClient.removeQueries({ queryKey: queryKeys.payment.all });
      queryClient.setQueryData(queryKeys.auth.user, result.user ?? null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("root.server", {
        type: "server",
        message: t("errors.serverError"),
      });
    }
  };

  return (
    <motion.div
      className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-orange-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-extrabold text-orange-600 mb-6 text-center">
        {t("title")}
      </h1>

      {errors.root?.server && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {errors.root.server.message}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="block mb-1 font-medium text-gray-700 text-sm"
          >
            {t("emailLabel")}
          </label>
          <input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-1 font-medium text-gray-700 text-sm"
          >
            {t("passwordLabel")}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              className={`w-full ps-4 pe-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <SubmitButton
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {t("noAccount")}{" "}
        <Link
          href="/SignUp"
          className="font-semibold text-secondary hover:underline"
        >
          {t("signUpLink")}
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;