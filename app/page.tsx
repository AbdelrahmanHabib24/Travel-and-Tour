"use client";

import Feature from "./componant/Feature";
import Hero from "./componant/Hero";
import Listing from "./componant/Listing";
import Testimonials from "./componant/Testimonials";
import ProtectedHome from "./componant/Home";
import Link from "next/link";  // Import Next.js Link component

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <ProtectedHome />
      <Hero />
      <Feature />
      <Listing />
      <Link href="#testimonials" scroll={false}>
  <Testimonials />
</Link>
    </div>
  );
}
