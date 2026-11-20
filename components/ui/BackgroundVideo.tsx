
"use client";

import Image from "next/image";
import React, { useState } from "react";

const BackgroundVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-slate-900">
      {/* Always-visible image fallback */}
      <Image
        src="/hero-poster.webp"
        alt=""
        width={1920}
        height={1080}
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        poster="/hero-poster.webp"
        onPlaying={() => setIsPlaying(true)}
        onWaiting={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
        className={`absolute inset-0 h-full w-full object-cover
          transition-opacity duration-700
          ${isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default BackgroundVideo;
