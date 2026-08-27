import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { PlanificacionCard } from './PlanificacionCard';
import type { DestinoWithActividades } from './PlanificacionCard';
import type { PlanificacionResponseDTO } from '../../types/planificacion';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('PlanificacionCard', () => {
  const mockPlanificacion: PlanificacionResponseDTO = {
    id: 1,
    titulo: 'Trip to Europe',
    descripcion: 'A fun trip across Europe',
    fechaInicio: '2099-10-01',
    fechaFin: '2099-10-15',
  };

  const mockDestinos: DestinoWithActividades[] = [
    {
      id: 101,
      nombre: 'Paris Trip',
      ciudad: 'Paris',
      pais: 'France',
      notas: '',
    },
    {
      id: 102,
      nombre: 'Rome Trip',
      ciudad: 'Rome',
      pais: 'Italy',
      notas: '',
    },
  ];

  it('renders planificacion details and destinations correctly', () => {
    render(
      <MemoryRouter>
        <PlanificacionCard planificacion={mockPlanificacion} destinos={mockDestinos} />
      </MemoryRouter>
    );

    // Check Planificacion title and description
    expect(screen.getByText('Trip to Europe')).toBeInTheDocument();
    expect(screen.getByText('A fun trip across Europe')).toBeInTheDocument();

    // Check Status badge
    expect(screen.getByText('Próximo')).toBeInTheDocument();

    // Check Destination tags
    expect(screen.getByText('Paris Trip')).toBeInTheDocument();
    expect(screen.getByText('Rome Trip')).toBeInTheDocument();
  });

  it('renders empty message when no destinations provided', () => {
    render(
      <MemoryRouter>
        <PlanificacionCard planificacion={mockPlanificacion} destinos={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText('Aún no agregaste destinos a este viaje.')).toBeInTheDocument();
  });

  it('navigates to trip destinations on card click', () => {
    render(
      <MemoryRouter>
        <PlanificacionCard planificacion={mockPlanificacion} destinos={mockDestinos} />
      </MemoryRouter>
    );

    const card = screen.getByRole('article');
    fireEvent.click(card);

    expect(mockedNavigate).toHaveBeenCalledWith('/planificaciones/1/destinos');
  });

  it('toggles favorite heart state on click without navigating', () => {
    render(
      <MemoryRouter>
        <PlanificacionCard planificacion={mockPlanificacion} destinos={mockDestinos} />
      </MemoryRouter>
    );

    const heartBtn = screen.getByTitle('Guardar en favoritos');
    expect(heartBtn).toBeInTheDocument();

    fireEvent.click(heartBtn);
    expect(screen.getByTitle('Quitar de favoritos')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked without navigating', () => {
    const onDeleteMock = vi.fn();
    render(
      <MemoryRouter>
        <PlanificacionCard
          planificacion={mockPlanificacion}
          destinos={mockDestinos}
          onDelete={onDeleteMock}
        />
      </MemoryRouter>
    );

    const deleteBtn = screen.getByTitle('Borrar Plan');
    fireEvent.click(deleteBtn);

    expect(onDeleteMock).toHaveBeenCalledWith(1);
  });
});
