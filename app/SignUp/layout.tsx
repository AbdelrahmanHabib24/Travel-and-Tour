import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen ">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-orange-50 to-white px-4 py-10">
        {children}
      </main>
    </div>
  );
}
