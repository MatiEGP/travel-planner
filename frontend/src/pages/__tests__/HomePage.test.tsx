import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';
import { useAuth } from '../../context/useAuth';

vi.mock('../../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('HomePage', () => {
  it('renders guest view with Registrarse and Iniciar sesión and no admin panel', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      usuario: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn().mockReturnValue(false),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Registrarse')).toBeInTheDocument();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.queryByText('Mis Planificaciones')).not.toBeInTheDocument();
    expect(screen.queryByText('Panel de Administración')).not.toBeInTheDocument();
  });

  it('renders client view with Mis Planificaciones and no admin panel', () => {
    const clientUser = {
      id: 1,
      nombre: 'Client',
      email: 'client@example.com',
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
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Mis Planificaciones')).toBeInTheDocument();
    expect(screen.queryByText('Registrarse')).not.toBeInTheDocument();
    expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument();
    expect(screen.queryByText('Panel de Administración')).not.toBeInTheDocument();
  });

  it('renders admin view with Mis Planificaciones and Panel de Administración', () => {
    const adminUser = {
      id: 1,
      nombre: 'Admin',
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
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Mis Planificaciones')).toBeInTheDocument();
    expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
  });
});
