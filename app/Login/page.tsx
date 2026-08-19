"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { z } from "zod";
import { loginSchema } from "@/app/ulits/zod";
import SubmitButton from "@/app/component/SubmitButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type LoginFormData = z.infer<typeof loginSchema>;
type LoginField = keyof LoginFormData;

type LoginApiResponse = {
  message?: string;
  errors?: Partial<Record<LoginField, string[]>>;
};

const Login: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const setServerErrors = (result: LoginApiResponse) => {
    const fieldErrors = result.errors;

    if (fieldErrors?.email?.[0]) {
      setError("email", { type: "server", message: fieldErrors.email[0] });
    }

    if (fieldErrors?.password?.[0]) {
      setError("password", {
        type: "server",
        message: fieldErrors.password[0],
      });
    }

    if (!fieldErrors?.email?.[0] && !fieldErrors?.password?.[0]) {
      setError("root.server", {
        type: "server",
        message: result.message || "There was a problem. Please try again.",
      });
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    clearErrors("root.server");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result: LoginApiResponse = await res.json();

      if (!res.ok) {
        setServerErrors(result);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("root.server", {
        type: "server",
        message: "There was a problem. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-orange-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-extrabold text-orange-600 mb-6 text-center">
          Login
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
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...register("email", {
                onChange: () => clearErrors("root.server"),
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full border rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...register("password", {
                  onChange: () => clearErrors("root.server"),
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <SubmitButton
            type="submit"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          >
            Login
          </SubmitButton>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
