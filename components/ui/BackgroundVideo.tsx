"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

const BackgroundVideo: React.FC = () => {
  const t = useTranslations("home.hero");
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black text-white p-4 text-center">
        {t("videoError")}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-900">
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
        <source src="/video.mp4" type="video/mp4" />
        {t("videoNotSupported")}
      </video>
    </div>
  );
};

export default BackgroundVideo;
