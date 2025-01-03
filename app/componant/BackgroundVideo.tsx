"use client";  

import React, { useEffect, useState } from "react";  

const BackgroundVideo: React.FC = () => {  
  const [isClient, setIsClient] = useState(false);  

  useEffect(() => {  
    setIsClient(true);  
  }, []);  

  if (!isClient) {  
    return null;  
  }  

  return (  
    <video  
      autoPlay  
      loop  
      muted  
      preload="auto"  
      className="absolute inset-0 w-full h-full object-cover"  
      aria-label="A scenic travel video playing in the background"  
      poster="/poster.jpg"  
    >  
      <source src="/video.mp4" type="video/mp4" />  
      Your browser does not support the video tag.  
    </video>  
  );  
};  

export default BackgroundVideo;