import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlanificacionDetailPage } from '../PlanificacionDetailPage';
import { planificacionService } from '../../api/planificacionService';
import { destinoService } from '../../../destinos/api/destinoService';
import { actividadService } from '../../../actividades/api/actividadService';
import { costoService } from '../../api/costoService';
import { itinerarioService } from '../../api/itinerarioService';

vi.mock('../../api/planificacionService');
vi.mock('../../../destinos/api/destinoService');
vi.mock('../../../actividades/api/actividadService');
vi.mock('../../api/costoService');
vi.mock('../../api/itinerarioService');

describe('PlanificacionDetailPage Integration', () => {
  const mockPlan = {
    id: 5,
    titulo: 'Aventura en París',
    descripcion: 'Vacaciones de 7 días',
    fechaInicio: '2026-10-01',
    fechaFin: '2026-10-07',
  };

  const mockDestinos = [
    { id: 1, nombre: 'Torre Eiffel', ciudad: 'París', pais: 'Francia', notas: 'Subir de noche' },
  ];

  const mockActividades = [
    { id: 10, destinoId: 1, nombre: 'Cena en la Torre', fechaHora: '2026-10-02T20:00:00', notas: 'Mesa con vista' },
  ];

  const mockCostos = [
    { id: 100, planificacionId: 5, categoria: 'Comida', monto: 120, descripcion: 'Cena bistró' },
  ];

  const mockDias = [
    {
      id: 200,
      planificacionId: 5,
      fecha: '2026-10-01',
      items: [
        { id: 300, diaItinerarioId: 200, tipo: 'VISITA', horaInicio: '15:00', notas: 'Llegada y check-in' },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(planificacionService.getById).mockResolvedValue(mockPlan);
    vi.mocked(destinoService.getByPlanificacion).mockResolvedValue(mockDestinos);
    vi.mocked(actividadService.getByPlanificacion).mockResolvedValue(mockActividades);
    vi.mocked(costoService.getByPlanificacion).mockResolvedValue(mockCostos);
    vi.mocked(itinerarioService.getDiasByPlanificacion).mockResolvedValue(mockDias);
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/planificaciones/5']}>
        <Routes>
          <Route path="/planificaciones/:planificacionId" element={<PlanificacionDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('loads and renders complete 3-column travel planning dashboard', async () => {
    renderComponent();

    // Verify loading indicator is present initially
    expect(screen.getByText('Cargando itinerario de viaje...')).toBeInTheDocument();

    // Wait for parallel data fetching to complete
    await waitFor(() => {
      expect(screen.getByText('Aventura en París')).toBeInTheDocument();
      expect(screen.getAllByText('Torre Eiffel').length).toBeGreaterThan(0);
      expect(screen.getByText('Cena en la Torre')).toBeInTheDocument();
      expect(screen.getByText('Cena bistró')).toBeInTheDocument();
      expect(screen.getByText('Llegada y check-in')).toBeInTheDocument();
    });

    expect(planificacionService.getById).toHaveBeenCalledWith(5);
    expect(destinoService.getByPlanificacion).toHaveBeenCalledWith(5);
    expect(actividadService.getByPlanificacion).toHaveBeenCalledWith(5);
    expect(costoService.getByPlanificacion).toHaveBeenCalledWith(5);
    expect(itinerarioService.getDiasByPlanificacion).toHaveBeenCalledWith(5);
  });

  it('renders error state when data fetch fails and allows retry', async () => {
    vi.mocked(planificacionService.getById).mockRejectedValueOnce(new Error('Network error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Error al cargar el viaje')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    // When retry button is clicked
    vi.mocked(planificacionService.getById).mockResolvedValueOnce(mockPlan);
    const retryBtn = screen.getByRole('button', { name: /Reintentar/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText('Aventura en París')).toBeInTheDocument();
    });
  });

  it('handles destination creation through modal and refreshes destinations', async () => {
    vi.mocked(destinoService.create).mockResolvedValueOnce({
      id: 2,
      nombre: 'Museo del Louvre',
      ciudad: 'París',
      pais: 'Francia',
      notas: '',
    });
    vi.mocked(destinoService.getByPlanificacion).mockResolvedValue([
      ...mockDestinos,
      { id: 2, nombre: 'Museo del Louvre', ciudad: 'París', pais: 'Francia', notas: '' },
    ]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Aventura en París')).toBeInTheDocument();
    });

    const addDestinoBtn = screen.getAllByRole('button', { name: /Agregar Destino/i })[0];
    fireEvent.click(addDestinoBtn);

    const nameInput = screen.getByLabelText(/Nombre del destino \*/i);
    const cityInput = screen.getByLabelText(/Ciudad \*/i);
    const countryInput = screen.getByLabelText(/País \*/i);

    fireEvent.change(nameInput, { target: { value: 'Museo del Louvre' } });
    fireEvent.change(cityInput, { target: { value: 'París' } });
    fireEvent.change(countryInput, { target: { value: 'Francia' } });

    const submitBtn = screen.getByRole('button', { name: /Guardar Destino/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(destinoService.create).toHaveBeenCalledWith({
        planificacionId: 5,
        nombre: 'Museo del Louvre',
        ciudad: 'París',
        pais: 'Francia',
        notas: '',
      });
      expect(screen.getAllByText('Museo del Louvre').length).toBeGreaterThan(0);
    });
  });

  it('handles expense deletion and updates state', async () => {
    vi.mocked(costoService.delete).mockResolvedValueOnce();
    vi.mocked(costoService.getByPlanificacion)
      .mockResolvedValueOnce(mockCostos)
      .mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Cena bistró')).toBeInTheDocument();
    });

    const deleteCostBtn = screen.getByTitle('Eliminar gasto');
    fireEvent.click(deleteCostBtn);

    await waitFor(() => {
      expect(costoService.delete).toHaveBeenCalledWith(100);
      expect(screen.getByText('Sin gastos registrados')).toBeInTheDocument();
    });
  });
});
