import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import { Suspense } from "react";
import GlobalLoading from "../loading";

export default function blogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <Suspense fallback={<GlobalLoading />}>{children}</Suspense>
      <Footer />
    </div>
  );
}
