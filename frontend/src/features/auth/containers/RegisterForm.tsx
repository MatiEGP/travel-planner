import { useState, type FormEvent, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';

export interface RegisterFormProps {
  onFlipToLogin: () => void;
  onSuccess?: () => void;
}

export const RegisterForm: FC<RegisterFormProps> = ({
  onFlipToLogin,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
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
        navigate('/planificaciones', { replace: true });
      }
    } catch (err) {
      setError((err as Error).message || 'Ocurrió un error al registrarse.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Creá tu cuenta
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
          Sumate a Fuimonos y empezá a organizar tus viajes hoy.
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

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Name Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <User className="w-5 h-5" />
          </div>
          <input
            id="register-name"
            type="text"
            required
            autoComplete="name"
            placeholder=" "
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="peer w-full pl-11 pr-4 pt-5 pb-2 bg-[#F1F3F4] dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-[#0D9488] focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-xl transition-all text-slate-900 dark:text-white text-base font-medium"
          />
          <label
            htmlFor="register-name"
            className="absolute left-11 top-4 text-slate-500 dark:text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#0D9488] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs font-semibold cursor-text"
          >
            Nombre completo
          </label>
        </div>

        {/* Email Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-5 h-5" />
          </div>
          <input
            id="register-email"
            type="email"
            required
            autoComplete="email"
            placeholder=" "
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="peer w-full pl-11 pr-4 pt-5 pb-2 bg-[#F1F3F4] dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-[#0D9488] focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-xl transition-all text-slate-900 dark:text-white text-base font-medium"
          />
          <label
            htmlFor="register-email"
            className="absolute left-11 top-4 text-slate-500 dark:text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#0D9488] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs font-semibold cursor-text"
          >
            Correo Electrónico
          </label>
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-5 h-5" />
          </div>
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder=" "
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="peer w-full pl-11 pr-12 pt-5 pb-2 bg-[#F1F3F4] dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-[#0D9488] focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-xl transition-all text-slate-900 dark:text-white text-base font-medium"
          />
          <label
            htmlFor="register-password"
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

        {/* Confirm Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-5 h-5" />
          </div>
          <input
            id="register-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder=" "
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="peer w-full pl-11 pr-12 pt-5 pb-2 bg-[#F1F3F4] dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-[#0D9488] focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-xl transition-all text-slate-900 dark:text-white text-base font-medium"
          />
          <label
            htmlFor="register-confirm-password"
            className="absolute left-11 top-4 text-slate-500 dark:text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#0D9488] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs font-semibold cursor-text"
          >
            Confirmar Contraseña
          </label>
          <button
            type="button"
            aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Submit CTA */}
        <div className="pt-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-base text-white bg-[#0D9488] hover:bg-[#0b7a70] shadow-lg shadow-[#0D9488]/30 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              'Crear cuenta'
            )}
          </motion.button>
        </div>
      </form>

      {/* Switch to Login */}
      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          ¿Ya tenés una cuenta?{' '}
          <button
            type="button"
            onClick={onFlipToLogin}
            className="text-[#0D9488] hover:text-[#0b7a70] dark:text-[#14b8a6] dark:hover:text-[#0d9488] font-bold transition-colors underline-offset-4 hover:underline cursor-pointer ml-1"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
};
