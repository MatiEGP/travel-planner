import { useState, type FormEvent, type FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export interface RegisterFormCardProps {
  isActive: boolean;
  onFlipToLogin: () => void;
  onCardClick?: () => void;
  onSuccess?: () => void;
}

export const RegisterFormCard: FC<RegisterFormCardProps> = ({
  isActive,
  onFlipToLogin,
  onCardClick,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirection destination post-register
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

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      });
      if (onSuccess) {
        onSuccess();
      } else {
        const dest = getDestination();
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setError((err as Error).message || 'Ocurrió un error al crear la cuenta.');
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
          Crear cuenta
        </h2>
        <p className="mt-1.5 text-slate-500 text-sm font-medium">
          Empezá a planificar tu próxima aventura hoy.
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
        {/* Full Name Input */}
        <div>
          <label htmlFor="register-name" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Nombre completo
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <User className="w-4 h-4" />
            </div>
            <input
              id="register-name"
              type="text"
              required
              autoComplete="name"
              placeholder="Juan Pérez"
              tabIndex={isActive ? 0 : -1}
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-[#F1F3F4] border border-transparent hover:border-slate-200 focus:border-[#0D9488] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 rounded-xl transition-all text-slate-800 placeholder-slate-400 text-sm font-medium"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="register-email" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Email
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="register-email"
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
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="register-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Contraseña
            </label>
            <span className="text-[11px] text-slate-500 font-normal">Mínimo 6 caracteres</span>
          </div>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
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
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="register-confirm-password" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Confirmar contraseña
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              placeholder="Confirmar contraseña"
              tabIndex={isActive ? 0 : -1}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full pl-10 pr-11 py-3 bg-[#F1F3F4] border border-transparent hover:border-slate-200 focus:border-[#0D9488] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 rounded-xl transition-all text-slate-800 placeholder-slate-400 text-sm font-medium"
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Ver confirmación de contraseña'}
              tabIndex={isActive ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmPassword(!showConfirmPassword);
              }}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terms and conditions Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="register-terms"
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            tabIndex={isActive ? 0 : -1}
            className="mt-1 w-4 h-4 rounded text-[#FF5A5F] focus:ring-[#FF5A5F] border-slate-300 cursor-pointer accent-[#FF5A5F]"
          />
          <label htmlFor="register-terms" className="text-xs text-slate-600 select-none cursor-pointer leading-tight">
            Acepto los <span className="text-slate-800 font-semibold underline underline-offset-2">términos de servicio</span> y la <span className="text-slate-800 font-semibold underline underline-offset-2">política de privacidad</span>.
          </label>
        </div>

        {/* Coral Submit CTA with ArrowRight */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || !isActive}
            tabIndex={isActive ? 0 : -1}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-bold text-sm text-white bg-[#FF5A5F] hover:bg-[#E0484D] active:scale-[0.99] shadow-md shadow-[#FF5A5F]/20 hover:shadow-[#FF5A5F]/30 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              <>
                <span>Crear cuenta</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Switch to Login */}
      <div className={`mt-6 text-center ${!isActive ? 'pointer-events-none' : ''}`}>
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          ¿Ya tenés una cuenta?{' '}
          <button
            type="button"
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation();
              onFlipToLogin();
            }}
            className="text-[#FF5A5F] hover:text-[#E0484D] font-bold transition-colors underline-offset-2 hover:underline cursor-pointer"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
};
