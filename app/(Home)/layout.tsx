import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import pick from "lodash/pick";

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const allMessages = await getMessages();
  const scopedMessages = pick(allMessages, ["common", "sunny", "home", "packages-listing"]);

  return (
    <NextIntlClientProvider locale={locale} messages={scopedMessages}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
