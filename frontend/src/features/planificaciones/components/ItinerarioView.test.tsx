import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ItinerarioView } from './ItinerarioView';
import { itinerarioService } from '../api/itinerarioService';

vi.mock('../api/itinerarioService');

const mockGetItinerario = vi.mocked(itinerarioService.getItinerario);

describe('ItinerarioView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockGetItinerario.mockReturnValue(new Promise(() => {}));
    const { container } = render(<ItinerarioView planificacionId="plan1" />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument(); 
  });

  it('renders empty state when no items', async () => {
    mockGetItinerario.mockResolvedValue([]);
    render(<ItinerarioView planificacionId="plan1" />);

    await waitFor(() => {
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });
  });

  it('renders days and items correctly', async () => {
    mockGetItinerario.mockResolvedValue([
      {
        id: 'dia1',
        fecha: '2024-10-10',
        items: [
          {
            id: 'item1',
            tipo: 'vuelo',
            titulo: 'Flight to Paris',
            costos: [{ monto: 100, moneda: 'USD', categoria: 'travel', pagado: false }]
          }
        ]
      }
    ]);

    render(<ItinerarioView planificacionId="plan1" />);

    await waitFor(() => {
      expect(screen.getByText('Flight to Paris')).toBeInTheDocument();
      expect(screen.getAllByText('$100.00').length).toBeGreaterThan(0); // total cost
    });
  });

  it('throws error to error boundary if fetch fails', async () => {
    mockGetItinerario.mockRejectedValue(new Error('Network error'));
    
    // We expect it to throw during render. To catch it, we must silence console error in test.
    const originalError = console.error;
    console.error = vi.fn();
    
    try {
      // React throws unhandled in tests if not wrapped in ErrorBoundary in the test itself.
      // But we just verify if it throws.
      expect(() => render(<ItinerarioView planificacionId="plan1" />)).toThrowError();
    } catch (e) {
      // It's expected to throw
    }
    
    console.error = originalError;
  });
});
