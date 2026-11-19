import PackageDetailsClient from "@/features/packages/components/details/PackageDetailsClient";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import pick from "lodash/pick";

export default async function PackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocale();
  const allMessages = await getMessages();
  const scopedMessages = pick(allMessages, ["common", "sunny", "package-details"]);

  return (
    <NextIntlClientProvider locale={locale} messages={scopedMessages}>
      <PackageDetailsClient id={id} />
    </NextIntlClientProvider>
  );
}
