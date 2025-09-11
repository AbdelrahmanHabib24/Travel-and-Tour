"use client";

// أو:
import Lottie from "lottie-react";
import loadingAnimation from "@/public/loading.json"; 

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <Lottie
        animationData={loadingAnimation}
        loop
        autoplay
        className="w-40 h-40" 
      />

    </div>
  );
}
