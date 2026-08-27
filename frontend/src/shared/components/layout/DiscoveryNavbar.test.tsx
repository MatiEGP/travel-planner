import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DiscoveryNavbar from './DiscoveryNavbar';
import { useAuth } from '../../../features/auth/context/useAuth';

vi.mock('../../../features/auth/context/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('DiscoveryNavbar', () => {
  it('renders guest navigation correctly', () => {
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
      <MemoryRouter>
        <DiscoveryNavbar />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('link', { name: /Travel Planner/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Registrarse/i })).toBeInTheDocument();
  });

  it('renders authenticated navigation correctly', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 1, nombre: 'TestUser', email: 'test@example.com', fechaRegistro: '', roles: [] },
      usuario: { id: 1, nombre: 'TestUser', email: 'test@example.com', fechaRegistro: '', roles: [] },
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DiscoveryNavbar />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('link', { name: /Travel Planner/i })).toBeInTheDocument();
    expect(screen.getByText('TestUser')).toBeInTheDocument();
  });
});
