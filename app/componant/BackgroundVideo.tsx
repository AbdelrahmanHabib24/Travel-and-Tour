"use client"; // تذكير باستخدام هذه السطر للمكونات التي تستخدم هوكات  

import React, { useEffect, useState } from "react";  

const BackgroundVideo: React.FC = () => {  
  const [isClient, setIsClient] = useState(false); // State للتحقق من كوننا على العميل  

  useEffect(() => {  
    setIsClient(true); // لا تقم بتحديث الحالة إلا في العميل  
  }, []);  

  if (!isClient) {  
    return null; // لا تعرض شيئًا على الخادم  
  }  

  return (  
    <video  
      autoPlay  
      loop  
      muted  
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