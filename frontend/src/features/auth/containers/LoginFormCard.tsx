import { useState, type FormEvent, type FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export interface LoginFormCardProps {
  isActive: boolean;
  onFlipToSignup: () => void;
  onCardClick?: () => void;
  onSuccess?: () => void;
}

export const LoginFormCard: FC<LoginFormCardProps> = ({
  isActive,
  onFlipToSignup,
  onCardClick,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirection destination post-login
  const getDestination = (): string => {
    const rawFrom = (location.state as { from?: { pathname?: string; search?: string; hash?: string } | string })?.from;
    if (!rawFrom) return '/planificaciones';
    if (typeof rawFrom === 'string') {
      return ['/login', '/register', '/registro', '/'].includes(rawFrom) ? '/planificaciones' : rawFrom;
    }
    const path = `${rawFrom.pathname || ''}${rawFrom.search || ''}${rawFrom.hash || ''}`;
    if (!path || ['/login', '/register', '/registro', '/'].includes(rawFrom.pathname || '')) {
      return '/planificaciones';
    }
    return path;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isActive || submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      await login(formData);
      if (onSuccess) {
        onSuccess();
      } else {
        const dest = getDestination();
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setError((err as Error).message || 'Ocurrió un error al iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardClick = () => {
    if (!isActive && onCardClick) {
      onCardClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`w-full max-w-md bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] text-slate-800 transition-all select-none ${
        !isActive ? 'cursor-pointer' : ''
      }`}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ¡Hola de nuevo!
        </h2>
        <p className="mt-1.5 text-slate-500 text-sm font-medium">
          Ingresá para continuar planificando tus viajes.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form
        className={`space-y-4 ${!isActive ? 'pointer-events-none' : ''}`}
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Email Input */}
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Email
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@email.com"
              tabIndex={isActive ? 0 : -1}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-[#F1F3F4] border border-transparent hover:border-slate-200 focus:border-[#0D9488] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 rounded-xl transition-all text-slate-800 placeholder-slate-400 text-sm font-medium"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Contraseña
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              tabIndex={isActive ? 0 : -1}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-11 py-3 bg-[#F1F3F4] border border-transparent hover:border-slate-200 focus:border-[#0D9488] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 rounded-xl transition-all text-slate-800 placeholder-slate-400 text-sm font-medium"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              tabIndex={isActive ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                setShowPassword(!showPassword);
              }}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex justify-end mt-1.5">
            <button
              type="button"
              tabIndex={isActive ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                // Future forgot password modal / route
              }}
              className="text-xs text-[#0D9488] hover:text-[#0b7a70] font-semibold transition-colors cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Coral Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || !isActive}
            tabIndex={isActive ? 0 : -1}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-bold text-sm text-white bg-[#FF5A5F] hover:bg-[#E0484D] active:scale-[0.99] shadow-md shadow-[#FF5A5F]/20 hover:shadow-[#FF5A5F]/30 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </div>
      </form>

      {/* Switch to Signup */}
      <div className={`mt-6 text-center ${!isActive ? 'pointer-events-none' : ''}`}>
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          ¿No tenés una cuenta?{' '}
          <button
            type="button"
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation();
              onFlipToSignup();
            }}
            className="text-[#FF5A5F] hover:text-[#E0484D] font-bold transition-colors underline-offset-2 hover:underline cursor-pointer"
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  );
};
