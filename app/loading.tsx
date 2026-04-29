// app/loading.tsx
"use client";

import dynamic from "next/dynamic";

const DotLottiePlayer = dynamic(
  () => import('@dotlottie/react-player').then(mod => mod.DotLottiePlayer),
  { ssr: false }
);

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl px-4">
      {/* Responsive container: scales with screen size but has max limits to stay professional */}
      <div className="w-[60vw] max-w-[160px] md:max-w-[240px] lg:max-w-[300px] aspect-square flex items-center justify-center -mt-10 md:-mt-16">
        <DotLottiePlayer
          src="/loading.lottie"
          autoplay
          loop
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
