"use client";

import dynamic from "next/dynamic";
import ProtectedHome from "./componant/Home";
import AppRoot from "./componant/AppRoot";
import Link from "next/link";
import Loading from "./loading"; 

const Hero = dynamic(() => import("./componant/Hero"), {
  ssr: true, 
  loading: () => <Loading />,
});

const Feature = dynamic(() => import("./componant/Feature"), {
  ssr: false,
  loading: () => <Loading />,
});

const Listing = dynamic(() => import("./componant/Listing"), {
  ssr: false,
  loading: () => <Loading />,
});

const Testimonials = dynamic(() => import("./componant/Testimonials"), {
  ssr: false,
  loading: () => <Loading />,
});

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
