import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
      <main className="flex-1">
        <Suspense fallback={<GlobalLoading />}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  );
}
