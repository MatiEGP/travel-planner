import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from '../RootLayout';
import { useAuth } from '../../context/useAuth';

vi.mock('../../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('RootLayout Header Suppression & Background Canvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });

  it('omits Header and applies bg-[#F7F9FA] when on /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="login" element={<div data-testid="login-content">Login Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const rootLayout = screen.getByTestId('root-layout');
    expect(rootLayout).toBeInTheDocument();
    expect(rootLayout).toHaveClass('bg-[#F7F9FA]');
    expect(rootLayout).not.toHaveClass('bg-slate-900');

    // Header navigation elements should not be present
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByText('Travel Planner')).not.toBeInTheDocument();
    expect(screen.getByTestId('login-content')).toBeInTheDocument();
  });

  it('omits Header and applies bg-[#F7F9FA] when on /register', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="register" element={<div data-testid="register-content">Register Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const rootLayout = screen.getByTestId('root-layout');
    expect(rootLayout).toBeInTheDocument();
    expect(rootLayout).toHaveClass('bg-[#F7F9FA]');
    expect(rootLayout).not.toHaveClass('bg-slate-900');

    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByText('Travel Planner')).not.toBeInTheDocument();
    expect(screen.getByTestId('register-content')).toBeInTheDocument();
  });

  it('omits Header and applies bg-[#F7F9FA] when on /registro', () => {
    render(
      <MemoryRouter initialEntries={['/registro']}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="registro" element={<div data-testid="registro-content">Registro Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const rootLayout = screen.getByTestId('root-layout');
    expect(rootLayout).toBeInTheDocument();
    expect(rootLayout).toHaveClass('bg-[#F7F9FA]');
    expect(rootLayout).not.toHaveClass('bg-slate-900');

    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByText('Travel Planner')).not.toBeInTheDocument();
    expect(screen.getByTestId('registro-content')).toBeInTheDocument();
  });

  it('renders Header and applies bg-slate-900 when on non-auth routes (e.g. /)', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<div data-testid="home-content">Home View</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const rootLayout = screen.getByTestId('root-layout');
    expect(rootLayout).toBeInTheDocument();
    expect(rootLayout).toHaveClass('bg-slate-900');
    expect(rootLayout).not.toHaveClass('bg-[#F7F9FA]');

    // Header navigation should be rendered
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Travel Planner')).toBeInTheDocument();
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });
});
