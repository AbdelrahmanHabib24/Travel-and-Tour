"use client";  

import React, { useEffect, useState } from "react";  
import Loading from "../loading"; // تأكد من أن لديك مكون التحميل هنا  

const BackgroundVideo: React.FC = () => {  
  const [isClient, setIsClient] = useState(false);  
  const [isVideoVisible, setIsVideoVisible] = useState(false);  
  const [isLoading, setIsLoading] = useState(true);  
  const [hasError, setHasError] = useState(false); // حالة جديدة للتعامل مع الأخطاء  

  useEffect(() => {  
    const loadVideo = async () => {  
      try {  
        const video = document.createElement('video');  
        video.src = '/video.mp4';  
        video.preload = 'auto';  

        await new Promise((resolve, reject) => {  
          video.onloadeddata = resolve;  
          video.onerror = reject;  
        });  

        setIsVideoVisible(true);  
        setIsLoading(false);  
      } catch (error) {  
        console.error("Error loading video:", error);  
        setHasError(true); // تعيين حالة الخطأ  
      }  
    };  

    loadVideo(); // استدعاء دالة تحميل الفيديو  

    setIsClient(true);  

    return () => {  
      setIsVideoVisible(false); // إعادة تعيين حالة الفيديو عندUnmounting  
      setIsLoading(true); // إعادة تعيين حالة التحميل  
    };  
  }, []);  

  if (isLoading) {  
    return <Loading />;  
  }  

  if (hasError) {  
    return <div className="error-message">فشل تحميل الفيديو. يرجى المحاولة لاحقًا.</div>; // عرض رسالة خطأ  
  }  

  if (!isClient || !isVideoVisible) {  
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