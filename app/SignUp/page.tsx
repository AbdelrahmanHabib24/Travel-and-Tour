"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "@/features/auth/components/SignupForm";
import { SignupFormValues } from "@/features/auth/validation/authSchemas";
import { authService } from "@/features/auth/services/auth.service";
import { useTranslations } from "next-intl";

type SignupFormData = SignupFormValues;

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const router = useRouter();
  const t = useTranslations("signup");

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const { ok, data: result } = await authService.signup(data);

      if (!ok) {
        if (result.errors) {
          setServerErrors(result.errors);
        } else if (result.message) {
          setServerErrors({ general: [result.message] });
        }
        return;
      }

      router.push("/Login");
    } catch (error) {
      console.error("Error during signup:", error);
      setServerErrors({
        general: [t("errors.serverError")],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white">
      <div className="w-full max-w-md rounded-2xl">
        <Form
          onSubmitForm={handleSignup}
          loading={loading}
          serverErrors={serverErrors}
        />
      </div>
    </div>
  );
};

export default Signup;
