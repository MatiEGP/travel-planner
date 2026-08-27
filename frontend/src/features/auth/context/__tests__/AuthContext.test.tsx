import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import { useAuth } from '../useAuth';
import { authService } from '../../api/authService';

vi.mock('../../api/authService', () => ({
  authService: {
    getMe: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

const TestConsumer = () => {
  const { user, isAuthenticated, isLoading, login, register, logout, hasRole } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</div>
      <div data-testid="user-name">{user ? user.nombre : 'no-user'}</div>
      <div data-testid="is-admin">{hasRole('ROLE_ADMIN') ? 'yes' : 'no'}</div>
      <div data-testid="is-client">{hasRole('CLIENT') ? 'yes' : 'no'}</div>
      <button
        onClick={() => login({ email: 'test@example.com', password: 'password123' })}
      >
        Login Button
      </button>
      <button
        onClick={() =>
          register({ nombre: 'Nuevo', email: 'nuevo@example.com', password: 'password123' })
        }
      >
        Register Button
      </button>
      <button onClick={() => logout()}>Logout Button</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hydrates authenticated user on mount', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Matias',
      email: 'matias@example.com',
      fechaRegistro: '2026-08-19T12:00:00',
      roles: ['ROLE_ADMIN', 'ROLE_CLIENT'],
    };
    vi.mocked(authService.getMe).mockResolvedValueOnce(mockUser);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    expect(screen.getByTestId('user-name')).toHaveTextContent('Matias');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('yes');
    expect(screen.getByTestId('is-client')).toHaveTextContent('yes');
  });

  it('hydrates as unauthenticated guest when getMe fails', async () => {
    vi.mocked(authService.getMe).mockRejectedValueOnce(new Error('Unauthorized'));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    });

    expect(screen.getByTestId('user-name')).toHaveTextContent('no-user');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('no');
  });

  it('updates state on successful login', async () => {
    vi.mocked(authService.getMe).mockRejectedValueOnce(new Error('Unauthorized'));
    const loggedUser = {
      id: 2,
      nombre: 'Carlos',
      email: 'carlos@example.com',
      fechaRegistro: '2026-08-19T12:00:00',
      roles: ['ROLE_CLIENT'],
    };
    vi.mocked(authService.login).mockResolvedValueOnce(loggedUser);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    });

    await act(async () => {
      screen.getByText('Login Button').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Carlos');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('no');
    expect(screen.getByTestId('is-client')).toHaveTextContent('yes');
  });

  it('updates state on successful logout', async () => {
    const mockUser = {
      id: 1,
      nombre: 'Matias',
      email: 'matias@example.com',
      fechaRegistro: '2026-08-19T12:00:00',
      roles: ['ROLE_ADMIN'],
    };
    vi.mocked(authService.getMe).mockResolvedValueOnce(mockUser);
    vi.mocked(authService.logout).mockResolvedValueOnce();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    await act(async () => {
      screen.getByText('Logout Button').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    expect(screen.getByTestId('user-name')).toHaveTextContent('no-user');
  });
});
