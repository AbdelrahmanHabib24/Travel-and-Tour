"use client";

import React, { useState } from "react";

const BackgroundVideo: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
        Failed to load the video. Please try again later.
      </div>
    );
  }

  return (
    <video
      src="/Video.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
      aria-label="A scenic travel video playing in the background"
      onError={() => setHasError(true)}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default BackgroundVideo;
