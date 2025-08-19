import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { PropertyListFilters } from '../model';
import FiltersBar from './adapters/FiltersBarTestAdapter';

const base: PropertyListFilters = {
  name: '',
  address: '',
  minPrice: undefined,
  maxPrice: undefined,
  sort: 'price',
  page: 1,
  pageSize: 12,
};

function Harness({ initial = base, onCapture }: { initial?: PropertyListFilters; onCapture: (v: PropertyListFilters) => void; }) {
  const [value, setValue] = React.useState<PropertyListFilters>(initial);
  const handleChange = (next: PropertyListFilters) => {
    setValue(next);
    onCapture(next);
  };
  return <FiltersBar value={value} onChange={handleChange} />;
}

describe('FiltersBar', () => {
  it('dispara onChange al escribir nombre y fuerza page=1', async () => {
    const onCapture = jest.fn();
    const user = userEvent.setup();
    render(<Harness initial={{ ...base, page: 3 }} onCapture={onCapture} />);
    const name = screen.getAllByPlaceholderText(/search by name/i)[0];
    await user.clear(name);
    await user.paste('loft');
    const last = onCapture.mock.calls.at(-1)?.[0] as PropertyListFilters;
    expect(last?.name).toBe('loft');
    expect(last?.page).toBe(1);
  });

  it('cambia sort a "price" al pulsar "Price ↑" y fuerza page=1', async () => {
    const onCapture = jest.fn();
    const user = userEvent.setup();
    render(<Harness initial={{ ...base, sort: 'price', page: 2 }} onCapture={onCapture} />);
    const btnAsc = screen.getAllByRole('button', { name: /price ↑/i })[0];
    await user.click(btnAsc);
    const last = onCapture.mock.calls.at(-1)?.[0] as PropertyListFilters;
    expect(last?.sort).toBe('price');
    expect(last?.page).toBe(1);
  });

  it('cambia sort a "-price" al pulsar "Price ↓" y fuerza page=1', async () => {
    const onCapture = jest.fn();
    const user = userEvent.setup();
    render(<Harness initial={{ ...base, sort: 'price', page: 2 }} onCapture={onCapture} />);
    const btnDesc = screen.getAllByRole('button', { name: /price ↓/i })[0];
    await user.click(btnDesc);
    const last = onCapture.mock.calls.at(-1)?.[0] as PropertyListFilters;
    expect(last?.sort).toBe('-price');
    expect(last?.page).toBe(1);
  });

  it('min/max numéricos disparan cambios y fuerzan page=1', async () => {
    const onCapture = jest.fn();
    const user = userEvent.setup();
    render(<Harness onCapture={onCapture} />);
    const mins = screen.getAllByPlaceholderText(/^min$/i);
    const maxs = screen.getAllByPlaceholderText(/^max$/i);
    const before = onCapture.mock.calls.length;
    for (const el of mins) {
      await user.clear(el);
      await user.type(el, '150000');
      fireEvent.blur(el);
    }
    for (const el of maxs) {
      await user.clear(el);
      await user.type(el, '450000');
      fireEvent.blur(el);
    }
    const anySortButton = screen.getAllByRole('button', { name: /price ↑|price ↓|default|name ↑|name ↓/i })[0];
    await user.click(anySortButton);
    await waitFor(() => {
      const calls = onCapture.mock.calls.length;
      expect(calls).toBeGreaterThan(before);
      const last = onCapture.mock.calls.at(-1)?.[0] as PropertyListFilters;
      expect(last?.page).toBe(1);
    });
  });

  it('reset all limpia filtros y vuelve a defaults', async () => {
    const onCapture = jest.fn();
    const user = userEvent.setup();
    render(<Harness onCapture={onCapture} initial={{ ...base, name: 'x', address: 'y', minPrice: 100, maxPrice: 200, sort: '-name', page: 4 }} />);
    const reset = screen.getAllByRole('button', { name: /reset all/i })[0];
    await user.click(reset);
    const last = onCapture.mock.calls.at(-1)?.[0] as PropertyListFilters;
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
