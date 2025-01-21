/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import InputField from "@/app/componant/InputField";
import SubmitButton from "@/app/componant/SubmitButton";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Home: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    validateField(name, formData[name as keyof FormData]);
  };

  const validateField = (fieldName: string, value: string): string => {
    let error = "";

    if (!value.trim()) {
      error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    } else if (fieldName === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Please enter a valid email address.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
    return error;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === formData.email && user.password === formData.password) {
          document.cookie = `authToken=${formData.email}||${formData.password}; expires=Fri, 31 Dec 2026 23:59:59 UTC; path=/;`;
          router.push("/");
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, email: "Invalid email or password." }));
        }
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: "No Email found. Please register first." }));
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isValid = Object.entries(formData).every(([key, value]) => {
      return !!value.trim() && (key !== "email" || /\S+@\S+\.\S+/.test(value));
    });

    setIsFormValid(isValid);
  }, [formData]);

  return (
    <div className="fix-height mt-10 flex justify-center items-center max_padd_container">
      <AnimatePresence>
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md w-96"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl bold-22 mb-4 text-center">Login</h1>

          <form onSubmit={handleSubmit} noValidate>
            <InputField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
            />
            <InputField
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
            />
            <SubmitButton isFormValid={isFormValid} loading={loading} />
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Home;
