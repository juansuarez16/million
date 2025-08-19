import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PropertyListFilters } from '../model';
import FiltersBar from './adapters/FiltersBarTestAdapter';

describe('FiltersBar', () => {
  const base: PropertyListFilters = {
    name: '',
    address: '',
    minPrice: undefined,
    maxPrice: undefined,
    sort: 'price',
    page: 1,
    pageSize: 12,
  };

  const setup = (value?: Partial<PropertyListFilters>) => {
    const onChange = jest.fn();
    render(<FiltersBar value={{ ...base, ...value }} onChange={onChange} />);
    return onChange;
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  it('dispara onChange al escribir nombre y fuerza page=1', async () => {
    const onChange = setup({ page: 3 });
    const user = userEvent.setup();
    const name = screen.getAllByPlaceholderText(/search by name/i)[0];

    await user.clear(name);
    await user.paste('loft');

    const lastCall = onChange.mock.calls.at(-1)?.[0] as PropertyListFilters;
    expect(lastCall?.name).toBe('loft');
    expect(lastCall?.page).toBe(1);
  });

  it('cambia sort a "price" al pulsar "Price ↑" y fuerza page=1', async () => {
    const onChange = setup({ sort: 'price', page: 2 });
    const user = userEvent.setup();
    const btnAsc = screen.getAllByRole('button', { name: /price ↑/i })[0];

    await user.click(btnAsc);

    const lastCall = onChange.mock.calls.at(-1)?.[0] as PropertyListFilters;
    expect(lastCall?.sort).toBe('price');
    expect(lastCall?.page).toBe(1);
  });

  it('cambia sort a "-price" al pulsar "Price ↓" y fuerza page=1', async () => {
    const onChange = setup({ sort: 'price', page: 2 });
    const user = userEvent.setup();
    const btnDesc = screen.getAllByRole('button', { name: /price ↓/i })[0];

    await user.click(btnDesc);

    const lastCall = onChange.mock.calls.at(-1)?.[0] as PropertyListFilters;
    expect(lastCall?.sort).toBe('-price');
    expect(lastCall?.page).toBe(1);
  });

  it('min/max numéricos y page=1', async () => {
    jest.useFakeTimers();
    const onChange = setup();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const mins = screen.getAllByPlaceholderText(/^min$/i);
    const maxs = screen.getAllByPlaceholderText(/^max$/i);

    for (const el of mins) {
      await user.clear(el);
      await user.type(el, '150000');
      el.blur();
    }
    for (const el of maxs) {
      await user.clear(el);
      await user.type(el, '450000');
      el.blur();
    }

    await act(async () => {
      jest.runOnlyPendingTimers();
      jest.runAllTimers();
    });

    await waitFor(() => {
      const calls = onChange.mock.calls.map(c => c[0] as PropertyListFilters);
      const minCall = [...calls].reverse().find(c => c && c.minPrice !== undefined && String(c.minPrice) === '150000');
      const maxCall = [...calls].reverse().find(c => c && c.maxPrice !== undefined && String(c.maxPrice) === '450000');
      expect(minCall).toBeDefined();
      expect(minCall?.page).toBe(1);
      expect(maxCall).toBeDefined();
      expect(maxCall?.page).toBe(1);
    }, { timeout: 4000 });
  });

  it('reset all limpia filtros y vuelve a defaults del componente', async () => {
    const onChange = setup({
      name: 'x',
      address: 'y',
      minPrice: 100,
      maxPrice: 200,
      sort: '-name',
      page: 4
    });
    const user = userEvent.setup();

    const reset = screen.getAllByRole('button', { name: /reset all/i })[0];
    await user.click(reset);

    const last = onChange.mock.calls.at(-1)?.[0] as PropertyListFilters;
    expect(last).toEqual(expect.objectContaining({
      name: undefined,
      address: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: undefined,
      page: 1
    }));
  });
});
