"use client";

import Link from "next/link";
import Hero from "@/features/home/components/Hero";
import Feature from "@/features/home/components/Feature";
import Listing from "@/features/packages/components/Listing";
import Testimonials from "@/features/home/components/Testimonials";

export default function Home() {
  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col">
      <Hero />
      <Feature />
      <Listing />
      <Link href="#testimonials" scroll={false}>
        <Testimonials />
      </Link>
    </div>
  );
}
