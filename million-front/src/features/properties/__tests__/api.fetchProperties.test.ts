import { fetchProperties } from '../api';
import type { PropertyListFilters } from '../model';

describe('api.fetchProperties', () => {
  const base = 'https://api.example.test';

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE = base;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], total: 0, page: 1, pageSize: 12 })
    } as unknown as Response);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('construye querystring con filtros y paginación', async () => {
    const filters: PropertyListFilters = {
      name: 'loft',
      address: 'medellin',
      minPrice: 100000,
      maxPrice: 500000,
      sort: '-price',
      page: 2,
      pageSize: 12
    };

    await fetchProperties(filters);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl.startsWith(`${base}/properties?`)).toBe(true);

    const qs = new URL(calledUrl).searchParams;
    expect(qs.get('name')).toBe('loft');
    expect(qs.get('address')).toBe('medellin');
    expect(qs.get('minPrice')).toBe('100000');
    expect(qs.get('maxPrice')).toBe('500000');
    expect(qs.get('sort')).toBe('-price');
    expect(qs.get('page')).toBe('2');
    expect(qs.get('pageSize')).toBe('12');
  });

  it('omite undefined y aplica defaults page=1 pageSize=12', async () => {
    const filters: PropertyListFilters = { name: 'casa' };

    await fetchProperties(filters);

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    const qs = new URL(calledUrl).searchParams;

    expect(qs.get('name')).toBe('casa');
    expect(qs.get('address')).toBeNull();
    expect(qs.get('minPrice')).toBeNull();
    expect(qs.get('maxPrice')).toBeNull();
    expect(qs.get('sort')).toBeNull();
    expect(qs.get('page')).toBe('1');
    expect(qs.get('pageSize')).toBe('12');
  });

  it('lanza error cuando la respuesta no es ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Boom'
    } as unknown as Response);

    await expect(fetchProperties({ name: 'x' })).rejects.toThrow('Request failed: 500 Boom');
  });
});
