import { Link, NavLink } from "react-router-dom";

export const Header = () => {
  // Esta función aplica clases de CSS diferentes si el enlace está activo
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-gray-900 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white font-bold text-xl">
            Travel Planner
          </Link>
          <div className="flex space-x-4">
            <NavLink to="/" className={getNavLinkClass} end>Inicio</NavLink>
            <NavLink to="/admin" className={getNavLinkClass}>Admin</NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};