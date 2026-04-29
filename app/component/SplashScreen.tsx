"use client";

import React, { useEffect, useState } from "react";
import GlobalLoading from "../loading";

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!isLoading) return null;

  return <GlobalLoading />;
}
