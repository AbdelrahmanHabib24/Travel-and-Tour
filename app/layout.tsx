import type { Metadata } from "next";  
import { Nunito } from "next/font/google"; // Assuming Nunito is a Google font  
import "slick-carousel/slick/slick.css";
import "./globals.css";  

import Header from "@/app/componant/Header"; // Corrected typo in the path 'componant' to 'component'  
import Footer from "@/app/componant/Footer"; // Same correction here  

const nunito = Nunito({  
  subsets: ["latin"],  
  weight: ["300", "400", "500", "600", "700", "800", "900"],  
  variable: "--font-nunito",  
});  

export const metadata: Metadata = {  
  title: "passport",  
  description: "tour and travel app",  
};  

export default function RootLayout({  
  children,  
}: Readonly<{  
  children: React.ReactNode;  
}>) {  
  return (  
    <html lang="en">  
      <body className={`bg-primary text-tertiary  overflow-x-hidden  ${nunito.variable}`}>  
        <Header />  

        {children}  

        <Footer />  
      </body>  
    </html>  
  );  
}