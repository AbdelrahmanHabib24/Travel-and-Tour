"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { z } from "zod";
import { loginSchema } from "@/app/ulits/zod";
import SubmitButton from "@/app/component/SubmitButton";

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setGeneralError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, msgs]) => {
            if (Array.isArray(msgs)) {
              setError(field as keyof LoginFormData, {
                type: "server",
                message: msgs[0],
              });
            }
          });
        } else if (result.message) {
          setGeneralError(result.message);
        }
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setGeneralError("Something went wrong. Please try again.");
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

        {generalError && (
          <p className="mb-4 text-center text-sm text-red-600">{generalError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring ${
                errors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring ${
                errors.password
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
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
