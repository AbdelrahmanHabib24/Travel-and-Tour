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
      router.push("/Login"); // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
    }
  }, [router]);

  return (
    <div>
      {/* محتوى الصفحة المحمية */}
    </div>
  );
};

export default ProtectedHome;
