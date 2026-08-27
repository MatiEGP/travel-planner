import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RoleRoute } from '../RoleRoute';
import { useAuth } from '../../context/useAuth';

vi.mock('../../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('RoleRoute', () => {
  it('renders loading indicator when auth is loading', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      usuario: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<RoleRoute requiredRole="ROLE_ADMIN" />}>
            <Route path="/admin" element={<div>Admin Panel</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Verificando permisos...')).toBeInTheDocument();
  });

  it('redirects to /login when unauthenticated', () => {
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
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<RoleRoute requiredRole="ROLE_ADMIN" />}>
            <Route path="/admin" element={<div>Admin Panel</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('redirects to redirectTo when user lacks required role', () => {
    const clientUser = {
      id: 1,
      nombre: 'Client User',
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
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<RoleRoute requiredRole="ROLE_ADMIN" redirectTo="/" />}>
            <Route path="/admin" element={<div>Admin Panel</div>} />
          </Route>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('renders child admin view when user has required role', () => {
    const adminUser = {
      id: 1,
      nombre: 'Admin User',
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
      hasRole: vi.fn((role) => role === 'ROLE_ADMIN' || role === 'ADMIN'),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<RoleRoute requiredRole="ROLE_ADMIN" />}>
            <Route path="/admin" element={<div>Admin Panel</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });
});
