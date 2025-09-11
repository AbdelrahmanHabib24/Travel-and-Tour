"use client";

import React, { useState } from "react";
import Loading from "@/app/loading"; // ✅ استدعاء الـ Loading component

const BackgroundVideo: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
        Failed to load the video. Please try again later.
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loading />
        </div>
      )}

      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setHasError(true)}
        onLoadedData={() => setLoaded(true)} 
      >
        <source src="/Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundVideo;
