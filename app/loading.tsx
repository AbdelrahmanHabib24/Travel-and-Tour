"use client";

import dynamic from "next/dynamic";

const DotLottiePlayer = dynamic(
  () => import("@dotlottie/react-player").then((mod) => mod.DotLottiePlayer),
  { ssr: false }
);

import "@dotlottie/react-player/dist/index.css";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
      <DotLottiePlayer
        src="/loading.lottie"
        autoplay
        loop
        style={{ width: 160, height: 160 }}
      />
    </div>
  );
}
