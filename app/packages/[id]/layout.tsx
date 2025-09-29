import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";


export default function PackageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen ">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
