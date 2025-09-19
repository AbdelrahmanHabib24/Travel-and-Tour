// app/loading.tsx
"use client";

import Lottie from "lottie-react";
import loadingAnimation from "@/app/loading.json";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
  <div className="absolute inset-0 bg-black/20 backdrop-blur-md"></div>
  <Lottie animationData={loadingAnimation} loop autoplay className="w-40 h-40" />
</div>

  );
}
