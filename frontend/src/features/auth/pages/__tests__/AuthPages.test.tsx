import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthPage } from '../AuthPage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { RootLayout } from '../../../../layouts/RootLayout';
import { useAuth } from '../../context/useAuth';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Unified Mirrored Auth View (AuthPage, LoginPage, RegisterPage)', () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();
  const mockLogout = vi.fn();
  const mockHasRole = vi.fn().mockReturnValue(false);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      usuario: null,
      login: mockLogin,
      register: mockRegister,
      logout: mockLogout,
      hasRole: mockHasRole,
    });
  });

  describe('AuthPage on /login', () => {
    it('renders scenic background with 3D perspective and Login card in forefront', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthPage />
        </MemoryRouter>
      );

      const layout = screen.getByTestId('auth-layout');
      expect(layout).toBeInTheDocument();
      expect(layout).toHaveClass('min-h-screen');
      expect(layout).toHaveClass('w-full');
      expect(layout).toHaveClass('flex');
      expect(layout).toHaveClass('items-center');
      expect(layout).toHaveClass('justify-center');
      expect(layout).toHaveClass('overflow-x-hidden');
      expect(screen.getByTestId('auth-bg-image')).toBeInTheDocument();

      const loginLayer = screen.getByTestId('auth-card-login');
      const signupLayer = screen.getByTestId('auth-card-signup');
      expect(loginLayer).toBeInTheDocument();
      expect(signupLayer).toBeInTheDocument();

      // Verify exact 3D mirrored transforms & styles for Login active
      expect(loginLayer.style.transform).toBe('translateZ(0) scale(1) translateX(0)');
      expect(loginLayer.style.opacity).toBe('1');
      expect(loginLayer.style.zIndex).toBe('20');
      expect(loginLayer.style.filter).toBe('blur(0px)');

      // Background Signup card offset to right with 3D depth and blur
      expect(signupLayer.style.transform).toBe('translateZ(-200px) scale(0.8) translateX(60%)');
      expect(signupLayer.style.opacity).toBe('0.5');
      expect(signupLayer.style.zIndex).toBe('10');
      expect(signupLayer.style.filter).toBe('blur(5px)');

      // Headings
      expect(within(loginLayer).getByRole('heading', { name: /¡Hola de nuevo!/i })).toBeInTheDocument();
      expect(within(loginLayer).getByRole('button', { name: /^Iniciar sesión$/i })).toBeInTheDocument();
    });

    it('renders top-left Travel Planner brand link to / and omits OAuth buttons', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthPage />
        </MemoryRouter>
      );

      const brandLink = screen.getByRole('link', { name: /Travel Planner/i });
      expect(brandLink).toBeInTheDocument();
      expect(brandLink).toHaveAttribute('href', '/');

      expect(screen.queryByRole('button', { name: /Continuar con Google/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Continuar con Apple/i })).not.toBeInTheDocument();
    });

    it('toggles password visibility between password and text', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthPage />
        </MemoryRouter>
      );

      const loginLayer = screen.getByTestId('auth-card-login');
      const passwordInput = document.getElementById('login-password') as HTMLInputElement;
      expect(passwordInput.type).toBe('password');

      const toggleButton = within(loginLayer).getByLabelText('Ver contraseña');
      await user.click(toggleButton);

      expect(passwordInput.type).toBe('text');
      expect(within(loginLayer).getByLabelText('Ocultar contraseña')).toBeInTheDocument();

      await user.click(within(loginLayer).getByLabelText('Ocultar contraseña'));
      expect(passwordInput.type).toBe('password');
    });

    it('switches to register mode when clicking "Crear cuenta" switch link', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthPage />
        </MemoryRouter>
      );

      const loginLayer = screen.getByTestId('auth-card-login');
      const switchButton = within(loginLayer).getByRole('button', { name: /^Crear cuenta$/i });
      await user.click(switchButton);

      expect(mockNavigate).toHaveBeenCalledWith('/register', expect.objectContaining({ replace: true }));
    });

    it('switches to register mode when clicking the background signup card wrapper', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthPage />
        </MemoryRouter>
      );

      const signupLayer = screen.getByTestId('auth-card-signup');
      await user.click(signupLayer);

      expect(mockNavigate).toHaveBeenCalledWith('/register', expect.objectContaining({ replace: true }));
    });

    it('submits login form successfully and navigates to /planificaciones', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValueOnce(undefined);

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthPage />
        </MemoryRouter>
      );

      const loginLayer = screen.getByTestId('auth-card-login');
      const emailInput = document.getElementById('login-email') as HTMLInputElement;
      const passwordInput = document.getElementById('login-password') as HTMLInputElement;
      const submitButton = within(loginLayer).getByRole('button', { name: /^Iniciar sesión$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'secret123');
      await user.click(submitButton);

      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'secret123',
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/planificaciones', { replace: true });
      });
    });

    it('displays error alert when login fails', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValueOnce(new Error('Credenciales inválidas'));

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthPage />
        </MemoryRouter>
      );

      const loginLayer = screen.getByTestId('auth-card-login');
      const emailInput = document.getElementById('login-email') as HTMLInputElement;
      const passwordInput = document.getElementById('login-password') as HTMLInputElement;
      const submitButton = within(loginLayer).getByRole('button', { name: /^Iniciar sesión$/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      const alert = await within(loginLayer).findByRole('alert');
      expect(alert).toHaveTextContent('Credenciales inválidas');
    });
  });

  describe('AuthPage on /register and /registro', () => {
    it('renders Signup active and Login in 3D background with -60% translateX', () => {
      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthPage />
        </MemoryRouter>
      );

      const loginLayer = screen.getByTestId('auth-card-login');
      const signupLayer = screen.getByTestId('auth-card-signup');

      // Verify exact 3D mirrored transforms & styles for Register active
      expect(signupLayer.style.transform).toBe('translateZ(0) scale(1) translateX(0)');
      expect(signupLayer.style.opacity).toBe('1');
      expect(signupLayer.style.zIndex).toBe('20');
      expect(signupLayer.style.filter).toBe('blur(0px)');

      // Background Login card offset to left with 3D depth and blur
      expect(loginLayer.style.transform).toBe('translateZ(-200px) scale(0.8) translateX(-60%)');
      expect(loginLayer.style.opacity).toBe('0.5');
      expect(loginLayer.style.zIndex).toBe('10');
      expect(loginLayer.style.filter).toBe('blur(5px)');

      expect(within(signupLayer).getByRole('heading', { name: /Crear cuenta/i })).toBeInTheDocument();
      expect(within(signupLayer).getByRole('button', { name: /^Crear cuenta$/i })).toBeInTheDocument();
      expect(document.getElementById('register-confirm-password')).toBeInTheDocument();
    });

    it('synchronizes mode correctly on /registro path alias', () => {
      render(
        <MemoryRouter initialEntries={['/registro']}>
          <AuthPage />
        </MemoryRouter>
      );

      const signupLayer = screen.getByTestId('auth-card-signup');
      expect(signupLayer.style.transform).toBe('translateZ(0) scale(1) translateX(0)');
      expect(signupLayer.style.opacity).toBe('1');
      expect(signupLayer.style.zIndex).toBe('20');
    });

    it('toggles primary and confirmation password visibility independently', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthPage />
        </MemoryRouter>
      );

      const signupLayer = screen.getByTestId('auth-card-signup');
      const passwordInput = document.getElementById('register-password') as HTMLInputElement;
      const confirmPasswordInput = document.getElementById('register-confirm-password') as HTMLInputElement;

      expect(passwordInput.type).toBe('password');
      expect(confirmPasswordInput.type).toBe('password');

      // Toggle primary password
      const primaryToggle = within(signupLayer).getByLabelText('Ver contraseña');
      await user.click(primaryToggle);
      expect(passwordInput.type).toBe('text');
      expect(confirmPasswordInput.type).toBe('password');

      // Toggle confirm password
      const confirmToggle = within(signupLayer).getByLabelText('Ver confirmación de contraseña');
      await user.click(confirmToggle);
      expect(passwordInput.type).toBe('text');
      expect(confirmPasswordInput.type).toBe('text');

      // Untoggle primary
      const primaryHideToggle = within(signupLayer).getByLabelText('Ocultar contraseña');
      await user.click(primaryHideToggle);
      expect(passwordInput.type).toBe('password');
      expect(confirmPasswordInput.type).toBe('text');
    });

    it('switches to login mode when clicking "Iniciar sesión" switch button', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthPage />
        </MemoryRouter>
      );

      const signupLayer = screen.getByTestId('auth-card-signup');
      const switchButton = within(signupLayer).getByRole('button', { name: /^Iniciar sesión$/i });
      await user.click(switchButton);

      expect(mockNavigate).toHaveBeenCalledWith('/login', expect.objectContaining({ replace: true }));
    });

    it('switches to login mode when clicking background login card wrapper', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthPage />
        </MemoryRouter>
      );

      const loginLayer = screen.getByTestId('auth-card-login');
      await user.click(loginLayer);

      expect(mockNavigate).toHaveBeenCalledWith('/login', expect.objectContaining({ replace: true }));
    });

    it('validates password length minimum 6 characters', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthPage />
        </MemoryRouter>
      );

      const signupLayer = screen.getByTestId('auth-card-signup');
      const nameInput = document.getElementById('register-name') as HTMLInputElement;
      const emailInput = document.getElementById('register-email') as HTMLInputElement;
      const passwordInput = document.getElementById('register-password') as HTMLInputElement;
      const confirmPasswordInput = document.getElementById('register-confirm-password') as HTMLInputElement;
      const termsCheckbox = document.getElementById('register-terms') as HTMLInputElement;
      const submitButton = within(signupLayer).getByRole('button', { name: /^Crear cuenta$/i });

      await user.type(nameInput, 'Juan Perez');
      await user.type(emailInput, 'juan@example.com');
      await user.type(passwordInput, '123'); // < 6 chars
      await user.type(confirmPasswordInput, '123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      expect(mockRegister).not.toHaveBeenCalled();
      const alert = await within(signupLayer).findByRole('alert');
      expect(alert).toHaveTextContent('La contraseña debe tener al menos 6 caracteres.');
    });

    it('validates password confirmation mismatch and blocks registration', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthPage />
        </MemoryRouter>
      );

      const signupLayer = screen.getByTestId('auth-card-signup');
      const nameInput = document.getElementById('register-name') as HTMLInputElement;
      const emailInput = document.getElementById('register-email') as HTMLInputElement;
      const passwordInput = document.getElementById('register-password') as HTMLInputElement;
      const confirmPasswordInput = document.getElementById('register-confirm-password') as HTMLInputElement;
      const termsCheckbox = document.getElementById('register-terms') as HTMLInputElement;
      const submitButton = within(signupLayer).getByRole('button', { name: /^Crear cuenta$/i });

      await user.type(nameInput, 'Juan Perez');
      await user.type(emailInput, 'juan@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'differentPassword');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      expect(mockRegister).not.toHaveBeenCalled();
      const alert = await within(signupLayer).findByRole('alert');
      expect(alert).toHaveTextContent('Las contraseñas no coinciden.');
    });

    it('validates terms and conditions acceptance', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthPage />
        </MemoryRouter>
      );

      const signupLayer = screen.getByTestId('auth-card-signup');
      const nameInput = document.getElementById('register-name') as HTMLInputElement;
      const emailInput = document.getElementById('register-email') as HTMLInputElement;
      const passwordInput = document.getElementById('register-password') as HTMLInputElement;
      const confirmPasswordInput = document.getElementById('register-confirm-password') as HTMLInputElement;
      const submitButton = within(signupLayer).getByRole('button', { name: /^Crear cuenta$/i });

      await user.type(nameInput, 'Juan Perez');
      await user.type(emailInput, 'juan@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      // Do not check terms checkbox
      await user.click(submitButton);

      expect(mockRegister).not.toHaveBeenCalled();
      const alert = await within(signupLayer).findByRole('alert');
      expect(alert).toHaveTextContent('Debes aceptar los términos y condiciones para continuar.');
    });

    it('submits registration form successfully and redirects when passwords match', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValueOnce(undefined);

      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthPage />
        </MemoryRouter>
      );

      const signupLayer = screen.getByTestId('auth-card-signup');
      const nameInput = document.getElementById('register-name') as HTMLInputElement;
      const emailInput = document.getElementById('register-email') as HTMLInputElement;
      const passwordInput = document.getElementById('register-password') as HTMLInputElement;
      const confirmPasswordInput = document.getElementById('register-confirm-password') as HTMLInputElement;
      const termsCheckbox = document.getElementById('register-terms') as HTMLInputElement;
      const submitButton = within(signupLayer).getByRole('button', { name: /^Crear cuenta$/i });

      await user.type(nameInput, 'Juan Perez');
      await user.type(emailInput, 'juan@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      expect(mockRegister).toHaveBeenCalledWith({
        nombre: 'Juan Perez',
        email: 'juan@example.com',
        password: 'password123',
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/planificaciones', { replace: true });
      });
    });

    it('displays error alert when registration fails', async () => {
      const user = userEvent.setup();
      mockRegister.mockRejectedValueOnce(new Error('El email ya está registrado'));

      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthPage />
        </MemoryRouter>
      );

      const signupLayer = screen.getByTestId('auth-card-signup');
      const nameInput = document.getElementById('register-name') as HTMLInputElement;
      const emailInput = document.getElementById('register-email') as HTMLInputElement;
      const passwordInput = document.getElementById('register-password') as HTMLInputElement;
      const confirmPasswordInput = document.getElementById('register-confirm-password') as HTMLInputElement;
      const termsCheckbox = document.getElementById('register-terms') as HTMLInputElement;
      const submitButton = within(signupLayer).getByRole('button', { name: /^Crear cuenta$/i });

      await user.type(nameInput, 'Juan Perez');
      await user.type(emailInput, 'juan@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      const alert = await within(signupLayer).findByRole('alert');
      expect(alert).toHaveTextContent('El email ya está registrado');
    });
  });

  describe('LoginPage and RegisterPage backwards compatibility', () => {
    it('LoginPage renders AuthPage in login mode', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      );

      const loginLayer = screen.getByTestId('auth-card-login');
      expect(loginLayer.style.transform).toBe('translateZ(0) scale(1) translateX(0)');
      expect(within(loginLayer).getByRole('heading', { name: /¡Hola de nuevo!/i })).toBeInTheDocument();
    });

    it('RegisterPage renders AuthPage in register mode', () => {
      render(
        <MemoryRouter initialEntries={['/register']}>
          <RegisterPage />
        </MemoryRouter>
      );

      const signupLayer = screen.getByTestId('auth-card-signup');
      expect(signupLayer.style.transform).toBe('translateZ(0) scale(1) translateX(0)');
      expect(within(signupLayer).getByRole('heading', { name: /Crear cuenta/i })).toBeInTheDocument();
    });
  });

  describe('RootLayout Header Suppression & Viewport Canvas', () => {
    it('omits global Header and renders bg-[#F7F9FA] container on /login', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route path="login" element={<AuthPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // Global Header banner is omitted
      expect(screen.queryByRole('banner')).not.toBeInTheDocument();
      // AuthLayout top-left brand link is rendered
      expect(screen.getByRole('link', { name: /Travel Planner/i })).toBeInTheDocument();

      const rootLayout = screen.getByTestId('root-layout');
      expect(rootLayout).toHaveClass('bg-[#F7F9FA]');
      expect(rootLayout).not.toHaveClass('bg-slate-900');

      const authLayout = screen.getByTestId('auth-layout');
      expect(authLayout).toHaveClass('min-h-screen');
      expect(authLayout).toHaveClass('overflow-x-hidden');
      expect(screen.getByTestId('auth-bg-image')).toBeInTheDocument();
    });

    it('omits global Header and renders bg-[#F7F9FA] container on /register', () => {
      render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route path="register" element={<AuthPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByRole('banner')).not.toBeInTheDocument();
      const rootLayout = screen.getByTestId('root-layout');
      expect(rootLayout).toHaveClass('bg-[#F7F9FA]');
      expect(rootLayout).not.toHaveClass('bg-slate-900');
    });
  });
});

