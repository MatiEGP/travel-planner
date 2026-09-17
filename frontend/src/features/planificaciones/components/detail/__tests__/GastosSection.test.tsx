import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GastosSection } from '../GastosSection';
import type { CostoResponseDTO } from '../../../types/costo';

describe('GastosSection', () => {
  const mockCostos: CostoResponseDTO[] = [
    { id: 1, planificacionId: 10, categoria: 'Alojamiento', monto: 300, descripcion: 'Hotel Roma 3 noches' },
    { id: 2, planificacionId: 10, categoria: 'Comida', monto: 75, descripcion: 'Almuerzo trattoria' },
  ];

  it('renders total expenses sum and expense cards', () => {
    render(
      <GastosSection
        planificacionId={10}
        costos={mockCostos}
        onAddCosto={vi.fn()}
        onDeleteCosto={vi.fn()}
      />
    );

    expect(screen.getByText('Gastos y Presupuesto')).toBeInTheDocument();
    expect(screen.getByText('Hotel Roma 3 noches')).toBeInTheDocument();
    expect(screen.getByText('Almuerzo trattoria')).toBeInTheDocument();
    expect(screen.getByText('$300,00')).toBeInTheDocument();
    expect(screen.getByText('$75,00')).toBeInTheDocument();
  });

  it('calls onDeleteCosto when delete button is clicked', () => {
    const onDeleteMock = vi.fn();
    render(
      <GastosSection
        planificacionId={10}
        costos={mockCostos}
        onAddCosto={vi.fn()}
        onDeleteCosto={onDeleteMock}
      />
    );

    const deleteBtns = screen.getAllByTitle('Eliminar gasto');
    fireEvent.click(deleteBtns[0]);

    expect(onDeleteMock).toHaveBeenCalledWith(1);
  });

  it('opens modal and submits new expense', async () => {
    const onAddMock = vi.fn().mockResolvedValue(undefined);
    render(
      <GastosSection
        planificacionId={10}
        costos={mockCostos}
        onAddCosto={onAddMock}
        onDeleteCosto={vi.fn()}
      />
    );

    const openModalBtn = screen.getByRole('button', { name: /Registrar Gasto/i });
    fireEvent.click(openModalBtn);

    expect(screen.getByText('Registrar Gasto', { selector: 'h3' })).toBeInTheDocument();

    const descInput = screen.getByLabelText(/Descripción \*/i);
    const montoInput = screen.getByLabelText(/Monto \(\$\) \*/i);

    fireEvent.change(descInput, { target: { value: 'Billetes de tren' } });
    fireEvent.change(montoInput, { target: { value: '50' } });

    const submitBtn = screen.getByRole('button', { name: /Guardar Gasto/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onAddMock).toHaveBeenCalledWith({
        planificacionId: 10,
        categoria: 'Alojamiento',
        monto: 50,
        descripcion: 'Billetes de tren',
      });
    });
  });
});
