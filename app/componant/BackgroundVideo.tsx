"use client";

import React, { useState, useEffect, useRef } from "react";

const BackgroundVideo: React.FC = () => {
  const [play, setPlay] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPlay(true); 
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
        Failed to load the video. Please try again later.
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay={play}
      loop={play}
      muted
      playsInline
      preload="none"
      className="absolute inset-0 w-full h-full object-cover"
      aria-label="A scenic travel video playing in the background"
      onError={() => setHasError(true)}
    >
      {play && <source src="/Video.mp4" type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
};

export default BackgroundVideo;
