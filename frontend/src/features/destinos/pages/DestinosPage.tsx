import { useParams, Navigate } from 'react-router-dom';
import PlannerLayout from '../../layouts/PlannerLayout';
import { ItinerarioView } from '../planificaciones/components/ItinerarioView';

export const DestinosPage = () => {
  const { planificacionId } = useParams<{ planificacionId: string }>();

  if (!planificacionId || isNaN(Number(planificacionId))) {
    return <Navigate to="/planificaciones" replace />;
  }

  return (
    <PlannerLayout>
      <ItinerarioView planificacionId={planificacionId} />
    </PlannerLayout>
  );
};
