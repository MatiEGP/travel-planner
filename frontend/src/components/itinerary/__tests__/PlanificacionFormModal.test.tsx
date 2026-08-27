import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlanificacionFormModal } from '../PlanificacionFormModal';
import { useAuth } from '../../../features/auth/context/useAuth';

vi.mock('../../../features/auth/context/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('PlanificacionFormModal', () => {
  const mockUser = {
    id: 1,
    nombre: 'Juan Perez',
    email: 'juan@example.com',
    fechaRegistro: '2024-01-01',
    roles: ['ROLE_CLIENT'],
  };

  beforeEach(() => {
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
  });

  it('does not render when isOpen is false', () => {
    render(
      <PlanificacionFormModal
        isOpen={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.queryByText('Crear Planificación')).not.toBeInTheDocument();
  });

  it('renders modal content when isOpen is true', () => {
    render(
      <PlanificacionFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByText('Crear Planificación')).toBeInTheDocument();
    expect(screen.getByLabelText(/Título del Viaje/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de Inicio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de Fin/i)).toBeInTheDocument();
  });

  it('submits form with correct data and calls onClose', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <PlanificacionFormModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText(/Título del Viaje/i), {
      target: { value: 'Viaje a Tokio' },
    });
    fireEvent.change(screen.getByLabelText(/Descripción/i), {
      target: { value: 'Visita a los templos y tecnología' },
    });
    fireEvent.change(screen.getByLabelText(/Fecha de Inicio/i), {
      target: { value: '2025-05-01' },
    });
    fireEvent.change(screen.getByLabelText(/Fecha de Fin/i), {
      target: { value: '2025-05-15' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Crear Viaje/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        usuarioId: 1,
        titulo: 'Viaje a Tokio',
        descripcion: 'Visita a los templos y tecnología',
        fechaInicio: '2025-05-01',
        fechaFin: '2025-05-15',
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('validates that end date is not before start date', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <PlanificacionFormModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText(/Título del Viaje/i), {
      target: { value: 'Viaje Inválido' },
    });
    fireEvent.change(screen.getByLabelText(/Descripción/i), {
      target: { value: 'Fechas invertidas' },
    });
    fireEvent.change(screen.getByLabelText(/Fecha de Inicio/i), {
      target: { value: '2025-05-15' },
    });
    fireEvent.change(screen.getByLabelText(/Fecha de Fin/i), {
      target: { value: '2025-05-01' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Crear Viaje/i }));

    expect(await screen.findByText(/La fecha de fin no puede ser anterior a la fecha de inicio/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
