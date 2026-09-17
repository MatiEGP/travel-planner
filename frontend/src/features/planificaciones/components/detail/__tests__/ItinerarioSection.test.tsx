import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ItinerarioSection } from '../ItinerarioSection';
import type { DiaItinerarioResponseDTO } from '../../../types/itinerario';
import type { ActividadResponseDTO } from '../../../../actividades/types/actividad';
import type { DestinoResponseDTO } from '../../../../destinos/types/destino';

describe('ItinerarioSection', () => {
  const mockActividades: ActividadResponseDTO[] = [
    {
      id: 50,
      destinoId: 1,
      nombre: 'Recorrido Coliseo',
      fechaHora: '2026-09-01T10:00:00',
      notas: 'Entrada por puerta norte',
    },
    {
      id: 51,
      destinoId: 1,
      nombre: 'Visita Museo Vaticano',
      fechaHora: '2026-09-01T15:00:00',
      notas: 'Guía en español',
    },
  ];

  const mockDestinos: DestinoResponseDTO[] = [
    {
      id: 1,
      nombre: 'Roma Centro',
      ciudad: 'Roma',
      pais: 'Italia',
      notas: 'Centro histórico',
    },
  ];

  const mockDias: DiaItinerarioResponseDTO[] = [
    {
      id: 1,
      planificacionId: 10,
      fecha: '2026-09-01',
      items: [
        {
          id: 101,
          diaItinerarioId: 1,
          tipo: 'ACTIVIDAD',
          referenciaId: 50,
          horaInicio: '10:00',
          horaFin: '12:00',
          notas: 'Entrada reservada',
        },
      ],
    },
    {
      id: 2,
      planificacionId: 10,
      fecha: '2026-09-02',
      items: [],
    },
  ];

  it('renders day tabs and items of the first day resolving activity name', () => {
    render(
      <ItinerarioSection
        planificacionId={10}
        fechaInicio="2026-09-01"
        fechaFin="2026-09-10"
        dias={mockDias}
        actividades={mockActividades}
        destinos={mockDestinos}
        onAddDia={vi.fn()}
        onDeleteDia={vi.fn()}
        onAddItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    expect(screen.getByText('Itinerario Día por Día')).toBeInTheDocument();
    expect(screen.getByText('Día 1')).toBeInTheDocument();
    expect(screen.getByText('Día 2')).toBeInTheDocument();
    expect(screen.getByText('Recorrido Coliseo')).toBeInTheDocument();
    expect(screen.getByText('Entrada reservada')).toBeInTheDocument();
    expect(screen.getByText('10:00 — 12:00')).toBeInTheDocument();
  });

  it('switches active day tab when clicking another day', () => {
    render(
      <ItinerarioSection
        planificacionId={10}
        fechaInicio="2026-09-01"
        fechaFin="2026-09-10"
        dias={mockDias}
        actividades={mockActividades}
        destinos={mockDestinos}
        onAddDia={vi.fn()}
        onDeleteDia={vi.fn()}
        onAddItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    const dia2Tab = screen.getByText('Día 2');
    fireEvent.click(dia2Tab);

    expect(screen.getByText('Sin actividades para este día')).toBeInTheDocument();
  });

  it('opens add day modal and calls onAddDia', async () => {
    const onAddDiaMock = vi.fn().mockResolvedValue(undefined);
    render(
      <ItinerarioSection
        planificacionId={10}
        fechaInicio="2026-09-01"
        fechaFin="2026-09-10"
        dias={mockDias}
        actividades={mockActividades}
        destinos={mockDestinos}
        onAddDia={onAddDiaMock}
        onDeleteDia={vi.fn()}
        onAddItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    const addDayBtn = screen.getByRole('button', { name: /Agregar Día/i });
    fireEvent.click(addDayBtn);

    expect(screen.getByText('Nuevo Día', { selector: 'h3' })).toBeInTheDocument();

    const dateInput = screen.getByLabelText(/Fecha del itinerario \*/i);
    fireEvent.change(dateInput, { target: { value: '2026-09-03' } });

    const submitBtn = screen.getByRole('button', { name: /Crear Día/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onAddDiaMock).toHaveBeenCalledWith({
        planificacionId: 10,
        fecha: '2026-09-03',
      });
    });
  });

  it('shows an error if trying to add an already existing day', async () => {
    render(
      <ItinerarioSection
        planificacionId={10}
        fechaInicio="2026-09-01"
        fechaFin="2026-09-10"
        dias={mockDias}
        actividades={mockActividades}
        destinos={mockDestinos}
        onAddDia={vi.fn()}
        onDeleteDia={vi.fn()}
        onAddItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    const addDayBtn = screen.getByRole('button', { name: /Agregar Día/i });
    fireEvent.click(addDayBtn);

    const dateInput = screen.getByLabelText(/Fecha del itinerario \*/i);
    // mockDias has 2026-09-01
    fireEvent.change(dateInput, { target: { value: '2026-09-01' } });

    const submitBtn = screen.getByRole('button', { name: /Crear Día/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Este día ya fue agregado al itinerario.')).toBeInTheDocument();
  });

  it('opens add item modal and calls onAddItem with chosen activity', async () => {
    const onAddItemMock = vi.fn().mockResolvedValue(undefined);
    render(
      <ItinerarioSection
        planificacionId={10}
        fechaInicio="2026-09-01"
        fechaFin="2026-09-10"
        dias={mockDias}
        actividades={mockActividades}
        destinos={mockDestinos}
        onAddDia={vi.fn()}
        onDeleteDia={vi.fn()}
        onAddItem={onAddItemMock}
        onDeleteItem={vi.fn()}
      />
    );

    const addItemBtn = screen.getByRole('button', { name: /Agregar Actividad/i });
    fireEvent.click(addItemBtn);

    expect(screen.getByText('Nueva Actividad / Item', { selector: 'h3' })).toBeInTheDocument();

    const selectAct = screen.getByLabelText(/Seleccionar Actividad \*/i);
    fireEvent.change(selectAct, { target: { value: '51' } });

    const inicioInput = screen.getByLabelText(/Hora Inicio/i);
    fireEvent.change(inicioInput, { target: { value: '15:00' } });

    const notasInput = screen.getByLabelText(/Notas \/ Observaciones/i);
    fireEvent.change(notasInput, { target: { value: 'Llegar 15 min antes' } });

    const submitBtn = screen.getByRole('button', { name: /Guardar Item/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onAddItemMock).toHaveBeenCalledWith({
        diaItinerarioId: 1,
        tipo: 'ACTIVIDAD',
        referenciaId: 51,
        horaInicio: '15:00',
        horaFin: undefined,
        notas: 'Llegar 15 min antes',
      });
    });
  });

  it('allows adding destination item to the itinerary', async () => {
    const onAddItemMock = vi.fn().mockResolvedValue(undefined);
    render(
      <ItinerarioSection
        planificacionId={10}
        fechaInicio="2026-09-01"
        fechaFin="2026-09-10"
        dias={mockDias}
        actividades={mockActividades}
        destinos={mockDestinos}
        onAddDia={vi.fn()}
        onDeleteDia={vi.fn()}
        onAddItem={onAddItemMock}
        onDeleteItem={vi.fn()}
      />
    );

    const addItemBtn = screen.getByRole('button', { name: /Agregar Actividad/i });
    fireEvent.click(addItemBtn);

    const tipoSelect = screen.getByLabelText(/Tipo de item \*/i);
    fireEvent.change(tipoSelect, { target: { value: 'DESTINO' } });

    const selectDest = screen.getByLabelText(/Seleccionar Destino \*/i);
    fireEvent.change(selectDest, { target: { value: '1' } });

    const submitBtn = screen.getByRole('button', { name: /Guardar Item/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onAddItemMock).toHaveBeenCalledWith({
        diaItinerarioId: 1,
        tipo: 'DESTINO',
        referenciaId: 1,
        horaInicio: undefined,
        horaFin: undefined,
        notas: undefined,
      });
    });
  });

  it('displays empty state warning in modal when no activities exist', () => {
    render(
      <ItinerarioSection
        planificacionId={10}
        fechaInicio="2026-09-01"
        fechaFin="2026-09-10"
        dias={mockDias}
        actividades={[]}
        destinos={mockDestinos}
        onAddDia={vi.fn()}
        onDeleteDia={vi.fn()}
        onAddItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    const addItemBtn = screen.getByRole('button', { name: /Agregar Actividad/i });
    fireEvent.click(addItemBtn);

    expect(
      screen.getByText(/No hay actividades registradas en este viaje/i)
    ).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Guardar Item/i });
    expect(submitBtn).toBeDisabled();
  });

  it('calls onDeleteItem when delete item button is clicked', () => {
    const onDeleteItemMock = vi.fn();
    render(
      <ItinerarioSection
        planificacionId={10}
        fechaInicio="2026-09-01"
        fechaFin="2026-09-10"
        dias={mockDias}
        actividades={mockActividades}
        destinos={mockDestinos}
        onAddDia={vi.fn()}
        onDeleteDia={vi.fn()}
        onAddItem={vi.fn()}
        onDeleteItem={onDeleteItemMock}
      />
    );

    const deleteBtn = screen.getByTitle('Eliminar actividad');
    fireEvent.click(deleteBtn);

    expect(onDeleteItemMock).toHaveBeenCalledWith(101);
  });

  it('calls onDeleteDia when delete day button is clicked', () => {
    const onDeleteDiaMock = vi.fn();
    render(
      <ItinerarioSection
        planificacionId={10}
        fechaInicio="2026-09-01"
        fechaFin="2026-09-10"
        dias={mockDias}
        actividades={mockActividades}
        destinos={mockDestinos}
        onAddDia={vi.fn()}
        onDeleteDia={onDeleteDiaMock}
        onAddItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    const deleteDayBtn = screen.getByTitle('Eliminar este día');
    fireEvent.click(deleteDayBtn);

    expect(onDeleteDiaMock).toHaveBeenCalledWith(1);
  });
});
