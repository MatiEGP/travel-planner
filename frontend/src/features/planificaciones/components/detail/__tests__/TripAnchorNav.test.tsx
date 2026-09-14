import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TripAnchorNav } from '../TripAnchorNav';

describe('TripAnchorNav', () => {
  it('renders all 4 navigation sections with count badges', () => {
    render(
      <TripAnchorNav
        destinosCount={2}
        actividadesCount={5}
        gastosCount={4}
        diasCount={7}
      />
    );

    expect(screen.getByText('Destinos')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getByText('Actividades')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('Gastos')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();

    expect(screen.getByText('Itinerario')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('triggers scrollIntoView when clicking section buttons', () => {
    const mockScrollIntoView = vi.fn();
    const mockElement = document.createElement('div');
    mockElement.id = 'section-gastos';
    mockElement.scrollIntoView = mockScrollIntoView;
    document.body.appendChild(mockElement);

    render(
      <TripAnchorNav
        destinosCount={1}
        actividadesCount={1}
        gastosCount={1}
        diasCount={1}
      />
    );

    const gastosBtn = screen.getByRole('button', { name: /Gastos/i });
    fireEvent.click(gastosBtn);

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    document.body.removeChild(mockElement);
  });
});
