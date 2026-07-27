import { useParams, Navigate } from 'react-router-dom';
import { DestinoManager } from '../components/DestinoManager';

export const DestinosPage = () => {
  const { planificacionId } = useParams<{ planificacionId: string }>();

  if (!planificacionId || isNaN(Number(planificacionId))) {
    return <Navigate to="/planificaciones" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DestinoManager planificacionId={Number(planificacionId)} />
    </div>
  );
};
