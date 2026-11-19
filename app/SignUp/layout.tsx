import Header from "@/components/layout/Header";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import pick from "lodash/pick";

export default async function SignupLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const allMessages = await getMessages();
  const scopedMessages = pick(allMessages, ["common", "sunny", "signup"]);

  return (
    <NextIntlClientProvider locale={locale} messages={scopedMessages}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gradient-to-b from-orange-50 to-white px-4 py-10">
          {children}
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
