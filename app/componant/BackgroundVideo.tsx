"use client";

import React, { useEffect, useState } from "react";
import Loading from "../loading";

const BackgroundVideo: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/video.mp4";
    video.preload = "auto";

    video.onloadeddata = () => setIsLoading(false);
    video.onerror = () => setHasError(true);

    setIsClient(true);

    return () => {
      setIsLoading(true);
      setHasError(false);
    };
  }, []);

  if (isLoading) return <Loading />;
  if (hasError) return <div className="error-message">Failed to load the video. Please try again later</div>;
  if (!isClient) return null;

  return (
    <video
      autoPlay
      loop
      muted
      preload="auto"
      poster="/poster.jpg"
      className="absolute inset-0 w-full h-full object-cover"
      aria-label="A scenic travel video playing in the background"
    >
      <source src="/video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default BackgroundVideo;
