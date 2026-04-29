// app/loading.tsx
"use client";

import Lottie from "lottie-react";
import loadingAnimation from "./loading.json";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-4 transition-all duration-300">
      <div className="w-[60vw] max-w-[160px] md:max-w-[240px] lg:max-w-[300px] aspect-square flex items-center justify-center -mt-10 md:-mt-16">
        <Lottie 
          animationData={loadingAnimation} 
          loop={true} 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
