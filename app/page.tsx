"use client";

import dynamic from "next/dynamic";
import ProtectedHome from "./component/Home";
import AppRoot from "./component/AppRoot";
import Link from "next/link";
import PageLoader from "@/app/component/PageLoader"; // ✅

const Hero = dynamic(() => import("./component/Hero"), {
  ssr: true,
  loading: () => <PageLoader />, // ⬅️
});

const Feature = dynamic(() => import("./component/Feature"), {
  ssr: false,
  loading: () => <PageLoader />, // ⬅️
});

const Listing = dynamic(() => import("./component/Listing"), {
  ssr: false,
  loading: () => <PageLoader />, // ⬅️
});

const Testimonials = dynamic(() => import("./component/Testimonials"), {
  ssr: false,
  loading: () => <PageLoader />, // ⬅️
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
