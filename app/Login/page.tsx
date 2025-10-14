"use client";

import React from "react";
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
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      console.log("Result from login API:", result);

      if (!res.ok) {
        if (result.errors?.email) {
          setError("email", {
            type: "server",
            message: result.errors.email[0],
          });
        }
        if (result.errors?.password) {
          setError("password", {
            type: "server",
            message: result.errors.password[0],
          });
        }
        return;
      }

      

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("email", {
        type: "server",
        message: "Server error. Please try again later.",
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
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
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
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
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
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
