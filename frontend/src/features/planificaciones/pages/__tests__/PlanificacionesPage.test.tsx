import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PlanificacionesPage } from '../PlanificacionesPage';
import { useAuth } from '../../../auth/context/useAuth';
import { planificacionService } from '../../api/planificacionService';
import { destinoService } from '../../../destinos/api/destinoService';

vi.mock('../../../auth/context/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../api/planificacionService', () => ({
  planificacionService: {
    getByUsuario: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../../destinos/api/destinoService', () => ({
  destinoService: {
    getByPlanificacion: vi.fn(),
  },
}));

describe('PlanificacionesPage', () => {
  const mockUser = {
    id: 1,
    nombre: 'Matias',
    email: 'matias@example.com',
    fechaRegistro: '2024-01-01',
    roles: ['ROLE_CLIENT'],
  };

  const mockTrips = [
    {
      id: 1,
      titulo: 'Viaje Futuro a Europa',
      descripcion: 'Recorriendo Paris y Roma',
      fechaInicio: '2099-06-01',
      fechaFin: '2099-06-20',
    },
    {
      id: 2,
      titulo: 'Aventura Pasada en Bariloche',
      descripcion: 'Nieve y chocolates',
      fechaInicio: '2020-07-01',
      fechaFin: '2020-07-10',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: mockUser,
      usuario: mockUser,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(),
    });

    vi.mocked(planificacionService.getByUsuario).mockResolvedValue(mockTrips);
    vi.mocked(destinoService.getByPlanificacion).mockResolvedValue([]);
  });

  it('renders H1 "Mis Viajes", Pill Tabs and "+ Crear Planificación" CTA', async () => {
    render(
      <MemoryRouter>
        <PlanificacionesPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Mis Viajes' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Próximos Viajes/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Viajes Pasados/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear Planificación/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Crear nueva planificación')).toBeInTheDocument();
    });
  });

  it('filters trips: shows upcoming trips by default and switches to past trips when tab is clicked', async () => {
    render(
      <MemoryRouter>
        <PlanificacionesPage />
      </MemoryRouter>
    );

    // Should load upcoming trips by default
    await waitFor(() => {
      expect(screen.getByText('Viaje Futuro a Europa')).toBeInTheDocument();
    });
    expect(screen.queryByText('Aventura Pasada en Bariloche')).not.toBeInTheDocument();

    // Click "Viajes Pasados" tab
    const pastTab = screen.getByRole('tab', { name: /Viajes Pasados/i });
    fireEvent.click(pastTab);

    // Should now show past trips
    expect(screen.getByText('Aventura Pasada en Bariloche')).toBeInTheDocument();
    expect(screen.queryByText('Viaje Futuro a Europa')).not.toBeInTheDocument();
    // QuickCreateCard is always present
    expect(screen.getByText('Crear nueva planificación')).toBeInTheDocument();
  });

  it('opens creation modal when clicking the CTA button', async () => {
    render(
      <MemoryRouter>
        <PlanificacionesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Cargando tus viajes...')).not.toBeInTheDocument();
    });

    const ctaButton = screen.getByRole('button', { name: /Crear Planificación/i });
    fireEvent.click(ctaButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/Título del Viaje/i)).toBeInTheDocument();
  });

  it('opens creation modal when clicking QuickCreateCard', async () => {
    render(
      <MemoryRouter>
        <PlanificacionesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Crear nueva planificación')).toBeInTheDocument();
    });

    const quickCard = screen.getByRole('button', { name: /Crear nueva planificación/i });
    fireEvent.click(quickCard);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('deletes a trip when confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(planificacionService.delete).mockResolvedValue();

    render(
      <MemoryRouter>
        <PlanificacionesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Viaje Futuro a Europa')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByTitle('Borrar Plan');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(planificacionService.delete).toHaveBeenCalledWith(1);
      expect(screen.queryByText('Viaje Futuro a Europa')).not.toBeInTheDocument();
    });
  });
});
