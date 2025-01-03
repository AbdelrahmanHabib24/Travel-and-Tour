import type { Metadata } from "next";  
import { Nunito } from "next/font/google";  
import "slick-carousel/slick/slick.css";  
import "./globals.css";  

import Header from "@/app/componant/Header";  
import Footer from "@/app/componant/Footer";  

const nunito = Nunito({  
  subsets: ["latin"],  
  weight: ["300", "400", "500", "600", "700", "800", "900"],  
  variable: "--font-nunito",  
});  

export const metadata: Metadata = {  
  title: "Passport",  
  description: "Tour and travel app",  
};  

export default function RootLayout({ children }: { children: React.ReactNode }) {  
  return (  
    <html lang="en">  
      <body className={`bg-primary text-tertiary  transition-all duration-300 ${nunito.variable}`}>  
        <Header />  

        <main>{children}</main>  

        <Footer />  
      </body>  
    </html>  
  );  
}