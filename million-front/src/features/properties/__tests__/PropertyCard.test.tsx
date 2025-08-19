import { render, screen } from '@testing-library/react';
import PropertyCard from './adapters/PropertyCardTestAdapter';
import type { PropertyDto } from '../model';

describe('PropertyCard', () => {
  const property: PropertyDto = {
    id: 'p1',
    idOwner: 'o1',
    name: 'Loft Poblado',
    address: 'Medellín, Antioquia',
    price: 350000000,
    imageUrl: 'https://picsum.photos/seed/p1/600/400'
  };

  it('renderiza nombre dirección y precio', () => {
    render(<PropertyCard property={property} />);
    expect(screen.getByText('Loft Poblado')).toBeInTheDocument();
    expect(screen.getByText(/Medellín, Antioquia/i)).toBeInTheDocument();
    expect(screen.getByText(/350/)).toBeInTheDocument();
  });

  it('renderiza imagen con alt igual al nombre', () => {
    render(<PropertyCard property={property} />);
    const img = screen.getByRole('img', { name: /loft poblado/i });
    expect(img).toHaveAttribute('src', property.imageUrl);
  });
});
