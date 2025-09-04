"use client";

import React, { useState } from "react";

const BackgroundVideo: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="error-message">
        Failed to load the video. Please try again later.
      </div>
    );
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="none" // 👈 مش هيعمل duplicate تحميل
      className="absolute inset-0 w-full h-full object-cover"
      aria-label="A scenic travel video playing in the background"
      onError={() => setHasError(true)}
    >
      <source src="/video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default BackgroundVideo;
