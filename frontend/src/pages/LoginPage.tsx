import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { AuthLayout } from '../layouts/AuthLayout';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Destino de redirección post-login
  const getDestination = (): string => {
    const rawFrom = (location.state as { from?: { pathname?: string; search?: string; hash?: string } | string })?.from;
    if (!rawFrom) return '/';
    if (typeof rawFrom === 'string') {
      return ['/login', '/register', '/registro'].includes(rawFrom) ? '/' : rawFrom;
    }
    const path = `${rawFrom.pathname || ''}${rawFrom.search || ''}${rawFrom.hash || ''}`;
    if (!path || ['/login', '/register', '/registro'].includes(rawFrom.pathname || '')) {
      return '/';
    }
    return path;
  };

  const from = getDestination();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      quote="El mundo es un libro, y quienes no viajan leen solo una página." 
      author="San Agustín"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">¡Hola de nuevo!</h2>
        <p className="mt-2 text-slate-500 font-medium text-lg">Ingresá para continuar planificando.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700">
                Contraseña
              </label>
              {/* Espacio para futuro "Olvidé mi contraseña" */}
            </div>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-slate-600">
          ¿No tenés una cuenta?{' '}
          <Link to="/register" className="text-teal-600 hover:text-teal-700 font-bold transition-colors">
            Registrate gratis
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
