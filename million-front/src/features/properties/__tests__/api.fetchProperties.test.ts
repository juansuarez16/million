import { fetchProperties } from '../api';
import type { PropertyListFilters, PagedResult, PropertyDto } from '../model';

describe('api.fetchProperties', () => {
  beforeEach(() => {
    const ok = {
      ok: true,
      json: async () => ({ items: [], total: 0, page: 1, pageSize: 12 } as PagedResult<PropertyDto>)
    } as Response;
    global.fetch = jest.fn().mockResolvedValue(ok) as unknown as typeof fetch;
  });

  it('construye querystring con name, address, rango y paginación', async () => {
    const filters: PropertyListFilters = {
      name: 'loft poblado',
      address: 'medellin',
      minPrice: 150000,
      maxPrice: 450000,
      sort: '-price',
      page: 1,
      pageSize: 12
    };
    await fetchProperties(filters);
    const call = (global.fetch as unknown as jest.Mock).mock.calls[0]?.[0] as string;
    const url = new URL(call);
    expect(url.searchParams.get('name')).toBe('loft poblado');
    expect(url.searchParams.get('address')).toBe('medellin');
    expect(url.searchParams.get('minPrice')).toBe('150000');
    expect(url.searchParams.get('maxPrice')).toBe('450000');
    expect(url.searchParams.get('sort')).toBe('-price');
    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.get('pageSize')).toBe('12');
  });

  it('omite parámetros no definidos', async () => {
    const filters: PropertyListFilters = {
      page: 2,
      pageSize: 24,
      sort: 'price'
    };
    await fetchProperties(filters);
    const call = (global.fetch as unknown as jest.Mock).mock.calls[0]?.[0] as string;
    const url = new URL(call);
    expect(url.searchParams.get('name')).toBeNull();
    expect(url.searchParams.get('address')).toBeNull();
    expect(url.searchParams.get('minPrice')).toBeNull();
    expect(url.searchParams.get('maxPrice')).toBeNull();
    expect(url.searchParams.get('sort')).toBe('price');
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.get('pageSize')).toBe('24');
  });
});
