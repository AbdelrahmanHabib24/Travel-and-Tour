"use client";

import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <DotLottiePlayer
        src="/loading.lottie"  
        autoplay
        loop
        style={{ width: "200px", height: "200px" }}
      />
    </div>
  );
}
