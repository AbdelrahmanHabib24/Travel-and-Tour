"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedHome: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  
    if (!authToken) {
      router.push("/"); 
    }
  }, [router]);
  
  return (
    <div>
    </div>
  );
};

export default ProtectedHome;
