"use client";

import dynamic from "next/dynamic";
import ProtectedHome from "./component/Home";
import AppRoot from "./component/AppRoot";
import Link from "next/link";
import GlobalLoading from "./loading";

const Hero = dynamic(() => import("./component/Hero"), {
  // ssr: false,
  // loading: () => <GlobalLoading/>, 
});

const Feature = dynamic(() => import("./component/Feature"), {
  // ssr: false,
  // loading: () => <GlobalLoading/>, 
});

const Listing = dynamic(() => import("./component/Listing"), {
  // ssr: true,
  // loading: () => <GlobalLoading/>, 
});

const Testimonials = dynamic(() => import("./component/Testimonials"), {
  // ssr: false,
  // loading: () => <GlobalLoading />, 
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
