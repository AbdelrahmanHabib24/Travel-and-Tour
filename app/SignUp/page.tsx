"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "@/app/component/Form";
import { z } from "zod";
import { serverSignupSchema } from "@/app/ulits/zod";

type SignupFormData = z.infer<typeof serverSignupSchema>;

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const router = useRouter();

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          setServerErrors(result.errors);
        } else if (result.message) {
          setServerErrors({ general: [result.message] });
        }
        return;
      }

      console.log("✅ Signup success:", result.user);
      router.push("/Login");
    } catch (error) {
      console.error("Error during signup:", error);
      setServerErrors({ general: ["Something went wrong. Please try again."] });
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md rounded-2xl px-5 py-10 sm:py-14 ">
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
