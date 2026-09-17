import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../Header';
import { useAuth } from '../../../../features/auth/context/useAuth';

vi.mock('../../../../features/auth/context/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Header', () => {
  it('renders light translucent surface with brand link and guest navigation', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      usuario: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass('bg-white/80');
    expect(banner).toHaveClass('backdrop-blur-md');
    expect(banner).toHaveClass('border-slate-200/80');

    const brandLink = screen.getByRole('link', { name: /Travel Planner/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute('href', '/');

    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
    expect(screen.queryByText('Planificaciones')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('renders authenticated client navigation with Planificaciones and user greeting', () => {
    const clientUser = {
      id: 1,
      nombre: 'Laura',
      email: 'laura@example.com',
      fechaRegistro: '2026-08-19T12:00:00',
      roles: ['ROLE_CLIENT'],
    };

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: clientUser,
      usuario: clientUser,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn().mockReturnValue(false),
    });

    render(
      <MemoryRouter initialEntries={['/planificaciones']}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Planificaciones')).toBeInTheDocument();
    expect(screen.getByText('Laura')).toBeInTheDocument();
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByTitle('Cerrar sesión')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('does NOT render Admin navigation link even when user has admin role', () => {
    const adminUser = {
      id: 1,
      nombre: 'Admin Master',
      email: 'admin@example.com',
      fechaRegistro: '2026-08-19T12:00:00',
      roles: ['ROLE_ADMIN'],
    };

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: adminUser,
      usuario: adminUser,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn((role) => role === 'ADMIN' || role === 'ROLE_ADMIN'),
    });

    render(
      <MemoryRouter initialEntries={['/planificaciones']}>
        <Header />
      </MemoryRouter>
    );

    // /admin link MUST NOT be present in consumer Header
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
    expect(screen.getByText('Admin Master')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument(); // Role badge inside user pill
  });

  it('renders login link correctly when on /login', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      usuario: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Header />
      </MemoryRouter>
    );

    const loginLink = screen.getByRole('link', { name: /Iniciar sesión/i });
    expect(loginLink).toBeInTheDocument();
  });

  it('opens accessible light-themed logout confirmation modal and handles cancel and confirm actions', async () => {
    const user = userEvent.setup();
    const mockLogout = vi.fn().mockResolvedValue(undefined);
    const clientUser = {
      id: 1,
      nombre: 'Laura',
      email: 'laura@example.com',
      fechaRegistro: '2026-08-19T12:00:00',
      roles: ['ROLE_CLIENT'],
    };

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: clientUser,
      usuario: clientUser,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
      hasRole: vi.fn().mockReturnValue(false),
    });

    render(
      <MemoryRouter initialEntries={['/planificaciones']}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const logoutTrigger = screen.getByTitle('Cerrar sesión');
    await user.click(logoutTrigger);

    // Modal dialog is displayed
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText('¿Cerrar sesión?')).toBeInTheDocument();
    expect(screen.getByText(/Tendrás que volver a ingresar tus credenciales/i)).toBeInTheDocument();

    // Cancel modal dismissal
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    await user.click(cancelButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockLogout).not.toHaveBeenCalled();

    // Reopen modal and confirm logout
    await user.click(logoutTrigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const confirmButton = screen.getByRole('button', { name: 'Cerrar sesión' });
    await user.click(confirmButton);
    expect(mockLogout).toHaveBeenCalled();
  });
});

