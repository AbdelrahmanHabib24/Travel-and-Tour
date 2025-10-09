// app/loading.tsx
"use client";

import loadingAnimation from "@/app/loading.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-white"></div>
      <Lottie
        animationData={loadingAnimation}
        loop
        autoplay
        className="w-40 h-40"
      />
    </div>
  );
}
