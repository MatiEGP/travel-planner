import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { AuthLayout } from '../layouts/AuthLayout';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Destino de redirección post-registro
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

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      quote="Viajar te deja sin palabras y después te convierte en un narrador de historias." 
      author="Ibn Battuta"
      imageSrc="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Crear cuenta</h2>
        <p className="mt-2 text-slate-500 font-medium text-lg">Empezá a planificar tu próxima aventura hoy.</p>
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
            <label htmlFor="reg-nombre" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nombre completo
            </label>
            <input
              id="reg-nombre"
              type="text"
              required
              autoComplete="name"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Contraseña <span className="text-slate-400 font-normal">(mínimo 6 caracteres)</span>
            </label>
            <input
              id="reg-password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>

          <div>
            <label htmlFor="reg-confirm" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Confirmar contraseña
            </label>
            <input
              id="reg-confirm"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                <span>Creando cuenta...</span>
              </>
            ) : (
              'Registrarse'
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-slate-600">
          ¿Ya tenés una cuenta?{' '}
          <Link to="/login" className="text-teal-600 hover:text-teal-700 font-bold transition-colors">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
