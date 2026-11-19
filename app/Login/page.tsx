import React from "react";
import LoginForm from "@/features/auth/components/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4 text-start">
      <LoginForm />
    </div>
  );
};

export default Login;
