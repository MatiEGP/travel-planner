import { useAuth } from '../context/useAuth';
import { PlanificacionManager } from '../components/PlanificacionManager';
// TODO: AUTH - Eliminar este import al implementar login
import { UserPicker } from '../components/temp/UserPicker';

export const PlanificacionesPage = () => {
  const { isAuthenticated } = useAuth();

  // TODO: AUTH - Eliminar esta condición. Con login real, el usuario siempre estará autenticado
  // al llegar a esta página (se usará un ProtectedRoute o similar).
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserPicker />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PlanificacionManager />
    </div>
  );
};
