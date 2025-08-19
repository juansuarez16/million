import React, { type ComponentProps } from 'react';
import FiltersBarReal from '../../components/FiltersBar';
import type { PropertyListFilters } from '../../model';

type TestProps = {
  value: PropertyListFilters;
  onChange: (next: PropertyListFilters) => void;
};

type RealProps = ComponentProps<typeof FiltersBarReal>;

export default function FiltersBarTestAdapter({ value, onChange }: TestProps) {
  const a = { value, onChange } as Partial<RealProps>;
  const b = { filters: value, onFiltersChange: onChange } as Partial<RealProps>;
  const merged = { ...a, ...b } as RealProps;
  return <FiltersBarReal {...merged} />;
}
