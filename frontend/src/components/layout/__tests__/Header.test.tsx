import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../Header';
import { useAuth } from '../../../context/useAuth';

vi.mock('../../../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Header', () => {
  it('renders guest navigation with Iniciar sesión and Registrarse links', () => {
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

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
    expect(screen.queryByText('Planificaciones')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
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
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('renders Admin navigation link when user is admin', () => {
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
      <MemoryRouter initialEntries={['/admin']}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
    expect(screen.getByText('Admin Master')).toBeInTheDocument();
  });

  it('applies active styling to login link when on /login', () => {
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

    const loginLink = screen.getByText('Iniciar sesión');
    expect(loginLink.className).toContain('bg-teal-900');
    expect(loginLink.className).toContain('text-white');
  });
});
