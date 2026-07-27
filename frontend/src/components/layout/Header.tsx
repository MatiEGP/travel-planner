import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  // TODO: AUTH - El useAuth() se mantiene igual con login real.
  const { usuario, setUsuario } = useAuth();

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-teal-900 text-white'
        : 'text-teal-100 hover:bg-teal-700 hover:text-white'
    }`;

  return (
    <header className="bg-teal-800 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Travel Planner
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex space-x-2">
              <NavLink to="/" className={getNavLinkClass} end>Inicio</NavLink>
              <NavLink to="/planificaciones" className={getNavLinkClass}>Planificaciones</NavLink>
              <NavLink to="/admin" className={getNavLinkClass}>Admin</NavLink>
            </div>

            {/* TODO: AUTH - Este bloque se reemplaza por el nombre del usuario logueado + botón de logout */}
            {usuario && (
              <div className="flex items-center gap-3 border-l border-teal-600 pl-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{usuario.nombre.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-teal-100 text-sm hidden sm:block">{usuario.nombre}</span>
                {/* TODO: AUTH - Cambiar este botón por un "Cerrar sesión" real */}
                <button
                  onClick={() => setUsuario(null)}
                  className="text-teal-300 hover:text-white text-xs transition-colors duration-200"
                  title="Cambiar usuario"
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};