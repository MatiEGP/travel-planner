import { useState, type FormEvent, type FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';

export interface LoginFormProps {
  onFlipToSignup: () => void;
  onSuccess?: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({
  onFlipToSignup,
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
    if (submitting) return;

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

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          ¡Hola de nuevo!
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
          Ingresá para continuar planificando tus viajes.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </motion.div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {/* Email Input (Floating Label) */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-5 h-5" />
          </div>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            placeholder=" "
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="peer w-full pl-11 pr-4 pt-5 pb-2 bg-[#F1F3F4] dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-[#0D9488] focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-xl transition-all text-slate-900 dark:text-white text-base font-medium"
          />
          <label
            htmlFor="login-email"
            className="absolute left-11 top-4 text-slate-500 dark:text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#0D9488] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs font-semibold cursor-text"
          >
            Correo Electrónico
          </label>
        </div>

        {/* Password Input (Floating Label) */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder=" "
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="peer w-full pl-11 pr-12 pt-5 pb-2 bg-[#F1F3F4] dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-[#0D9488] focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-xl transition-all text-slate-900 dark:text-white text-base font-medium"
            />
            <label
              htmlFor="login-password"
              className="absolute left-11 top-4 text-slate-500 dark:text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#0D9488] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs font-semibold cursor-text"
            >
              Contraseña
            </label>
            <button
              type="button"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="text-sm text-[#0D9488] hover:text-[#0b7a70] dark:text-teal-400 dark:hover:text-teal-300 font-semibold transition-colors cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-base text-white bg-[#FF5A5F] hover:bg-[#E0484D] shadow-lg shadow-[#FF5A5F]/30 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              'Iniciar sesión'
            )}
          </motion.button>
        </div>
      </form>

      {/* Switch to Signup */}
      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          ¿No tenés una cuenta?{' '}
          <button
            type="button"
            onClick={onFlipToSignup}
            className="text-[#FF5A5F] dark:text-[#FF5A5F] hover:text-[#E0484D] font-bold transition-colors underline-offset-4 hover:underline cursor-pointer ml-1"
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  );
};
