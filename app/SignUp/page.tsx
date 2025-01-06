"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for client-side navigation
import Form from "@/app/componant/Form";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // Use next/navigation for client-side routing

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    validateField(name, formData[name as keyof typeof formData]);
  };

  const validateField = (fieldName: string, value: string) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const upperCaseRegex = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/;
    let error = "";

    switch (fieldName) {
      case "username":
        if (!value.trim()) error = "Username is required.";
        break;
      case "email":
        if (!value.trim()) error = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(value))
          error = "Please enter a valid email address.";
        break;
      case "password":
        if (!value.trim()) error = "Password is required.";
        else if (value.length < 6)
          error = "Password must be at least 6 characters long.";
        else if (!upperCaseRegex.test(value))
          error = "Password must include at least one uppercase letter.";
        else if (!specialCharRegex.test(value))
          error = "Password must include at least one special character.";
      
        break;
      case "confirmPassword":
        if (!value.trim()) error = "Please confirm your password.";
        else if (value !== formData.password)
          error = "Passwords do not match.";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
  };

  const validateForm = (): boolean => {
    const { username, email, password, confirmPassword } = formData;
    const newErrors: { [key: string]: string | undefined } = {};

    validateField("username", username);
    validateField("email", email);
    validateField("password", password);
    validateField("confirmPassword", confirmPassword);

    Object.keys(formData).forEach((key) => {
      if (errors[key]) newErrors[key] = errors[key];
    });

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      localStorage.setItem("user", JSON.stringify(formData));
      console.log("Form Data Submitted:", formData);
      router.push("/Login"); // Client-side navigation
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" fix-height flexCenter pt-14 mb-5  max_padd_container">
      <div className="w-96 border rounded-lg border-co bg-white p-6">
        <h1 className="flexCenter bold-22 mb-4 ">Sign up</h1>
      <Form
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSubmit={handleSubmit}
        loading={loading}
        isFormValid={Object.values(errors).every((error) => !error)}
      />
      </div>
    </div>
  );
};

export default Signup;
