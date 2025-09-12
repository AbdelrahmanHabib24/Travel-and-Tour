"use client";

import ProtectedHome from "./component/Home";
import AppRoot from "./component/AppRoot";
import Link from "next/link";
import Hero from "./component/Hero";
import Feature from "./component/Feature";
import Listing from "./component/Listing";
import Testimonials from "./component/Testimonials";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <ProtectedHome />
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
