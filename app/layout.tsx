import type { Metadata } from "next";  
import { Nunito } from "next/font/google";  
import "slick-carousel/slick/slick.css";  
import "./globals.css";  

// Corrected import paths for Header and Footer  
import Header from "@/app/componant/Header";  
import Footer from "@/app/componant/Footer";  

// Load the Nunito font  
const nunito = Nunito({  
  subsets: ["latin"],  
  weight: ["300", "400", "500", "600", "700", "800", "900"],  
  variable: "--font-nunito",  
});  

// Define application metadata  
export const metadata: Metadata = {  
  title: "Passport",  
  description: "Tour and travel app",  
};  

// Root layout component  
export default function RootLayout({ children }: { children: React.ReactNode }) {  
  return (  
    <html lang="en">  
      <body className={`bg-primary text-tertiary overflow-x-hidden transition-all duration-300 ${nunito.variable}`}>  
        <Header />  

        <main>{children}</main> {/* Wrapping children in a <main> tag for semantic structure */}  

        <Footer />  
      </body>  
    </html>  
  );  
}