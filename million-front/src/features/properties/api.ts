import { PagedResult, PropertyDto, PropertyListFilters } from "./model";

const base = process.env.NEXT_PUBLIC_API_BASE!;

const qs = (params: Record<string, string | number | boolean | undefined | null>) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");

export async function fetchProperties(filters: PropertyListFilters) {
  const url = `${base}/properties?${qs(filters)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed ${res.status}`);
  return (await res.json()) as PagedResult<PropertyDto>;
}

export async function fetchPropertyById(id: string) {
  const res = await fetch(`${base}/properties/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed ${res.status}`);
  return (await res.json()) as PropertyDto;
}
