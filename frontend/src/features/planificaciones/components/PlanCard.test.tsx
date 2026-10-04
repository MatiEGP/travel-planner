import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { PlanCard } from './PlanCard';
import type { PlanificacionResponseDTO } from '../types/planificacion';

describe('PlanCard', () => {
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
        <PlanCard planificacion={mockPlanificacion} destinos={[]} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    expect(screen.getByText('Trip to Europe')).toBeInTheDocument();
    expect(screen.getByText('A fun trip across Europe')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDeleteMock = vi.fn();
    render(
      <MemoryRouter>
        <PlanCard planificacion={mockPlanificacion} destinos={[]} onDelete={onDeleteMock} />
      </MemoryRouter>
    );
    
    // The trash icon doesn't have text "Eliminar", but it has an aria-label
    const deleteButton = screen.getByLabelText('Eliminar viaje');
    fireEvent.click(deleteButton);
    expect(onDeleteMock).toHaveBeenCalledWith(1);
  });
});

