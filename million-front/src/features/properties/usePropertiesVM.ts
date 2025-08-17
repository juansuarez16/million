"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { fetchProperties } from "./api";
import { PropertyListFilters } from "./model";
import { useDebounce } from "@/shared/hooks/useDebounce";

function readFilters(sp: URLSearchParams): PropertyListFilters {
  const num = (k: string) => (sp.get(k) ? Number(sp.get(k)) : undefined);
  const s = (k: string) => sp.get(k) || undefined;
  return {
    name: s("name"),
    address: s("address"),
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    page: num("page") ?? 1,
    pageSize: num("pageSize") ?? 12,
    sort: (s("sort") as PropertyListFilters["sort"]) ?? undefined,
  };
}

export function usePropertiesVM() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const filters = useMemo(() => readFilters(sp), [sp]);

  const debounced = useDebounce({ name: filters.name, address: filters.address }, 400);

  const query = useQuery({
    queryKey: ["properties", { ...filters, ...debounced }],
    queryFn: () => fetchProperties({ ...filters, ...debounced }),
    placeholderData: (prev) => prev,
  });

  function setFilter(next: Partial<PropertyListFilters>) {
    const params = new URLSearchParams(sp.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") params.delete(k);
      else params.set(k, String(v));
    });
    if (next.name !== undefined || next.address !== undefined) params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  function paginate(page: number) { setFilter({ page }); }

  return { filters, query, setFilter, paginate };
}
