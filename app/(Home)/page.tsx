"use client";

import Link from "next/link";
import Hero from "../component/Hero";
import Feature from "../component/Feature";
import Listing from "../component/Listing";
import Testimonials from "../component/Testimonials";

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
