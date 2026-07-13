import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold my-6 text-gray-900">
        Bienvenido a Travel Planner
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Organiza tus viajes de manera sencilla y eficiente. Crea planes, añade
        destinos y gestiona tus actividades, todo en un solo lugar.
      </p>
      <div className="space-x-4">
        <Link
          to="/admin"
          className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Panel de Administración
        </Link>
      </div>
    </div>
  );
};