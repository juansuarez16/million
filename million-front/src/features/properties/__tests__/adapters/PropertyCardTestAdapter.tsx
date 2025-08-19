import React, { type ComponentProps } from 'react';
import PropertyCardReal from '../../components/PropertyCard';
import type { PropertyDto } from '../../model';

type TestProps = { property: PropertyDto };
type RealProps = ComponentProps<typeof PropertyCardReal>;

export default function PropertyCardTestAdapter({ property }: TestProps) {
  const propsA = { property } as Partial<RealProps>;
  const propsB = { p: property } as Partial<RealProps>;
  const merged = { ...propsA, ...propsB } as RealProps;
  return <PropertyCardReal {...merged} />;
}
