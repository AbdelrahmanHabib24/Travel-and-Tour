import { use } from "react";

import dynamic from "next/dynamic";

const PackageDetailsClient = dynamic(() => import("./PackageDetailsClient"), { ssr: true });


export default function PackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  return <PackageDetailsClient id={id} />;
}
