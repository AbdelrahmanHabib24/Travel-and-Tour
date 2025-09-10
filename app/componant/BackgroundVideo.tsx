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
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      disableRemotePlayback
      className="absolute inset-0 w-full h-full object-cover"
      onError={() => setHasError(true)}
    >
      <source src="/Video.webm" type="video/webm" />
      <source src="/Video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default BackgroundVideo;
