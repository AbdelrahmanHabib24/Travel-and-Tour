"use client";

import Link from "next/link";
import AppRoot from "../component/AppRoot";
import Hero from "../component/Hero";
import Feature from "../component/Feature";
import Listing from "../component/Listing";
import Testimonials from "../component/Testimonials";

export default function Home() {
  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col">
      <AppRoot
        appConfig={{
          startButtonText: "Travel Assistant",
          isPreConnectBufferEnabled: true,
        }}
      />
      <Hero />
      <Feature />
      <Listing />
      <Link href="#testimonials" scroll={false}>
        <Testimonials />
      </Link>
    </div>
  );
}
