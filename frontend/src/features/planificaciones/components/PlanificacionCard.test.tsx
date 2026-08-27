import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { PlanificacionCard } from './PlanificacionCard';
import type { PlanificacionResponseDTO } from '../../planificaciones/types/planificacion';

describe('PlanificacionCard', () => {
  const mockPlanificacion: PlanificacionResponseDTO = {
    id: 1,
    titulo: 'Trip to Europe',
    descripcion: 'A fun trip across Europe',
    fechaInicio: '2023-10-01',
    fechaFin: '2023-10-15',
  };

  it('renders planificacion details correctly', () => {
    const onDeleteMock = vi.fn();
    render(
      <MemoryRouter>
        <PlanificacionCard planificacion={mockPlanificacion} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    expect(screen.getByText('Trip to Europe')).toBeInTheDocument();
    expect(screen.getByText('A fun trip across Europe')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDeleteMock = vi.fn();
    render(
      <MemoryRouter>
        <PlanificacionCard planificacion={mockPlanificacion} onDelete={onDeleteMock} />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Eliminar'));
    expect(onDeleteMock).toHaveBeenCalledWith(1);
  });
});
