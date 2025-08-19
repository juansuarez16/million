import type { PropertyDto, PropertyListFilters, PagedResult } from './model';

const baseUrl = () => process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, '') ?? '';

const buildQuery = (filters: PropertyListFilters) => {
  const params = new URLSearchParams();
  const set = (k: string, v: string | number | undefined) => {
    if (v !== undefined && v !== '') params.set(k, String(v));
  };
  set('name', filters.name);
  set('address', filters.address);
  set('minPrice', filters.minPrice);
  set('maxPrice', filters.maxPrice);
  set('sort', filters.sort);
  set('page', filters.page ?? 1);
  set('pageSize', filters.pageSize ?? 12);
  return params.toString();
};

export async function fetchProperties(filters: PropertyListFilters): Promise<PagedResult<PropertyDto>> {
  const qs = buildQuery(filters);
  const url = `${baseUrl()}/properties${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Request failed: ${res.status}${msg ? ` ${msg}` : ''}`);
  }
  return res.json();
}

export async function fetchPropertyById(id: string): Promise<PropertyDto> {
  const url = `${baseUrl()}/properties/${encodeURIComponent(id)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Request failed: ${res.status}${msg ? ` ${msg}` : ''}`);
  }
  return res.json();
}
