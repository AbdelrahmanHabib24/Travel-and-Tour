import PackageDetailsClient from "./PackageDetailsClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${baseUrl}/api/packages/${id}`, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to fetch package");

  const data = await res.json();

  return <PackageDetailsClient id={id} initialData={data} />;
}
