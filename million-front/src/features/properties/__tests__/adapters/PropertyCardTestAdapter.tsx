import React, { type ComponentProps } from 'react';
import PropertyCardReal from '../../components/PropertyCard';
import type { PropertyDto } from '../../model';

type TestProps = { property: PropertyDto };
type RealProps = ComponentProps<typeof PropertyCardReal>;

export default function PropertyCardTestAdapter({ property }: TestProps) {
  const a = { property } as Partial<RealProps>;
  const b = { p: property } as Partial<RealProps>;
  const merged = { ...a, ...b } as RealProps;
  return <PropertyCardReal {...merged} />;
}
