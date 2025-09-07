import { use } from "react";
import PackageDetailsClient from "./PackageDetailsClient";

export default function PackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  return <PackageDetailsClient id={id} />;
}
