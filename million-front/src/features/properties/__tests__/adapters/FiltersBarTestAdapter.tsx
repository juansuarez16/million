import React, { type ComponentProps } from 'react';
import FiltersBarReal from '../../components/FiltersBar';
import type { PropertyListFilters } from '../../model';

type TestProps = {
  value: PropertyListFilters;
  onChange: (next: PropertyListFilters) => void;
};

type RealProps = ComponentProps<typeof FiltersBarReal>;

export default function FiltersBarTestAdapter({ value, onChange }: TestProps) {
  const propsA = { value, onChange } as Partial<RealProps>;
  const propsB = { filters: value, onFiltersChange: onChange } as Partial<RealProps>;
  const merged = { ...propsA, ...propsB } as RealProps;
  return <FiltersBarReal {...merged} />;
}
