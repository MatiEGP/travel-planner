import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';
import { useAuth } from '../../../auth/context/useAuth';
import { ThemeProvider } from '../../../../context/ThemeContext';

vi.mock('../../../auth/context/useAuth', () => ({
  useAuth: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('HomePage', () => {
  it('renders guest view with Iniciar sesión and Comenzá ahora and no admin panel', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isHydrating: false, isLoading: false,
      user: null,
      usuario: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn().mockReturnValue(false),
    });

    render(
      <MemoryRouter>
        <ThemeProvider>
          <HomePage />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Comenzar Aventura')).toBeInTheDocument();
    expect(screen.getByText('Ingresar')).toBeInTheDocument();
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
      isHydrating: false, isLoading: false,
      user: clientUser,
      usuario: clientUser,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn().mockReturnValue(false),
    });

    render(
      <MemoryRouter>
        <ThemeProvider>
          <HomePage />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Mis Planificaciones')).toBeInTheDocument();
    expect(screen.queryByText('Comenzar Aventura')).not.toBeInTheDocument();
    expect(screen.queryByText('Ingresar')).not.toBeInTheDocument();
    expect(screen.queryByText('Panel de Administración')).not.toBeInTheDocument();
  });

  it('does not render Panel de Administración even for admin role', () => {
    const adminUser = {
      id: 1,
      nombre: 'Admin',
      email: 'admin@example.com',
      fechaRegistro: '2026-08-19T12:00:00',
      roles: ['ROLE_ADMIN'],
    };

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isHydrating: false, isLoading: false,
      user: adminUser,
      usuario: adminUser,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn((role) => role === 'ADMIN' || role === 'ROLE_ADMIN'),
    });

    render(
      <MemoryRouter>
        <ThemeProvider>
          <HomePage />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Mis Planificaciones')).toBeInTheDocument();
    expect(screen.queryByText('Panel de Administración')).not.toBeInTheDocument();
  });
});
