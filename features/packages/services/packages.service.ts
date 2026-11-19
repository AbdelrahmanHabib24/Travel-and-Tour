import { apiRequest } from "@/lib/http/apiClient";
import type { PackageRecord } from "../types";

export interface PackageFilters {
  city?: string;
  maxPrice?: number;
}

export async function getPackages<T = PackageRecord>(
  filters?: PackageFilters
): Promise<T[]> {
  let url = "/api/packages";

  if (filters) {
    const params = new URLSearchParams();
    if (filters.city !== undefined) {
      params.set("city", filters.city);
    }
    if (
      filters.maxPrice !== undefined &&
      Number.isFinite(filters.maxPrice)
    ) {
      params.set("maxPrice", String(filters.maxPrice));
    }
    const qs = params.toString();
    if (qs) {
      url = `${url}?${qs}`;
    }
  }

  const data = await apiRequest<unknown>(url);
  return Array.isArray(data) ? (data as T[]) : [];
}

export async function getPackageById(id: string): Promise<PackageRecord> {
  return apiRequest<PackageRecord>(
    `/api/packages/${encodeURIComponent(id)}`,
    { cache: "force-cache" }
  );
}

export const packagesService = {
  getPackages,
  getPackageById,
};