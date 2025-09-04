import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import PackageDetailsClient from "./PackageDetailsClient";

async function fetchPackage(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/packages/${id}`, {
    cache: "no-store", // SSR: always fresh
  });
  if (!res.ok) throw new Error("Failed to fetch package");
  return res.json();
}

export default async function PackagePage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  // Prefetch for SSR
  await queryClient.prefetchQuery({
    queryKey: ["package", params.id],
    queryFn: () => fetchPackage(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PackageDetailsClient id={params.id} />
    </HydrationBoundary>
  );
}
