import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { TripDetailHeader } from '../TripDetailHeader';
import type { PlanificacionResponseDTO } from '../../../types/planificacion';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('TripDetailHeader', () => {
  const mockPlan: PlanificacionResponseDTO = {
    id: 1,
    titulo: 'Viaje a Roma y Florencia',
    descripcion: 'Vacaciones de verano con amigos',
    fechaInicio: '2099-08-01',
    fechaFin: '2099-08-15',
  };

  it('renders trip title, description, and status correctly', () => {
    render(
      <MemoryRouter>
        <TripDetailHeader
          planificacion={mockPlan}
          destinosCount={3}
          actividadesCount={8}
          gastosTotal={1500}
          diasCount={14}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Viaje a Roma y Florencia')).toBeInTheDocument();
    expect(screen.getByText('Vacaciones de verano con amigos')).toBeInTheDocument();
    expect(screen.getByText('Próximo')).toBeInTheDocument();
  });

  it('renders all 4 summary stats counters', () => {
    render(
      <MemoryRouter>
        <TripDetailHeader
          planificacion={mockPlan}
          destinosCount={3}
          actividadesCount={8}
          gastosTotal={1500}
          diasCount={14}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Destinos')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Actividades')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('Días Itinerario')).toBeInTheDocument();
    expect(screen.getByText('Gastos Totales')).toBeInTheDocument();
  });

  it('navigates back to /planificaciones when back button is clicked', () => {
    render(
      <MemoryRouter>
        <TripDetailHeader
          planificacion={mockPlan}
          destinosCount={1}
          actividadesCount={2}
          gastosTotal={100}
          diasCount={3}
        />
      </MemoryRouter>
    );

    const backBtn = screen.getByLabelText('Volver a mis viajes');
    fireEvent.click(backBtn);

    expect(mockedNavigate).toHaveBeenCalledWith('/planificaciones');
  });
});
