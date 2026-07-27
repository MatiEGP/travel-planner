import { useParams, Navigate } from 'react-router-dom';
import { ActividadManager } from '../components/ActividadManager';

export const ActividadesPage = () => {
  const { destinoId } = useParams<{ destinoId: string }>();

  if (!destinoId || isNaN(Number(destinoId))) {
    return <Navigate to="/planificaciones" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ActividadManager destinoId={Number(destinoId)} />
    </div>
  );
};
