import type { PropertyDto, PropertyListFilters, PagedResult } from "./model";



// Base del API:
// - Prod: usa NEXT_PUBLIC_API_BASE (https real)
// - Dev SSR: si no hay env, usa http://localhost:5000/api
// - Browser sin env: /api (relativo)
const base = (() => {
  const env = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "");
  if (env) return env;
  if (typeof window === "undefined") return "http://localhost:5000/api";
  return "/api";
})();
const allProperties: PropertyDto[] = [];

export function getAllProperties() {
  return allProperties;
}
const buildQuery = (f: PropertyListFilters) => {
  const p = new URLSearchParams();
  const set = (k: string, v: string | number | undefined) => {
    if (v !== undefined && v !== "") p.set(k, String(v));
  };
  set("name", f.name);
  set("address", f.address);
  set("minPrice", f.minPrice);
  set("maxPrice", f.maxPrice);
  set("sort", f.sort);
  set("page", f.page ?? 1);
  set("pageSize", f.pageSize ?? 12);
  return p.toString();
};

async function safeFetch(url: string): Promise<Response> {
  const isServer = typeof window === "undefined";
  console.log(`[safeFetch] GET ${url} | Servidor: ${isServer}`);
  return fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
}

export async function fetchProperties(f: PropertyListFilters): Promise<PagedResult<PropertyDto>> {
  const qs = buildQuery(f);
  const res = await safeFetch(`${base}/properties${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const allRes = (await res.json()) as PagedResult<PropertyDto>;
  allProperties.splice(0, allProperties.length, ...allRes.items);
  return allRes;
}

export async function fetchPropertyById(id: string): Promise<PropertyDto> {
  if (typeof window === "undefined") {
    throw new Error("fetchPropertyById debe ejecutarse en cliente");
  }
  const url = `${base}/properties/${encodeURIComponent(id)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as PropertyDto;
}