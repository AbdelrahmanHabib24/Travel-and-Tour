import { use } from "react";
import PackageDetailsClient from "./PackageDetailsClient";

export default function PackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ use() يحل مشكلة Promise
  return <PackageDetailsClient id={id} />;
}
