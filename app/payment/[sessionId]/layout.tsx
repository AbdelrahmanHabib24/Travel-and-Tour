import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import { Suspense } from "react";
import GlobalLoading from "@/app/loading";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <Suspense fallback={<GlobalLoading />}>{children}</Suspense> 
    </div>
  );
}
