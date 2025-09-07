"use client";

import Feature from "./componant/Feature";
import Hero from "./componant/Hero";
import Listing from "./componant/Listing";
import Testimonials from "./componant/Testimonials";
import ProtectedHome from "./componant/Home";
import Link from "next/link";

import AppRoot from "./componant/AppRoot";

export default function Home() {

  return (
    <div className="overflow-x-hidden">
      <ProtectedHome />

      {/* <AppRoot
        appConfig={{
          startButtonText: "Travel Assistant",
          isPreConnectBufferEnabled: true,
        }}
      /> */}

      <Hero />
      <Feature />
      <Listing />
      <Link href="#testimonials" scroll={false}>
        <Testimonials />
      </Link>
    </div>
  );
}
