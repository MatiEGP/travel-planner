import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { AdminPage } from '../pages/AdminPage';
import { PlanificacionesPage } from '../pages/PlanificacionesPage';
import { DestinosPage } from '../pages/DestinosPage';
import { ActividadesPage } from '../pages/ActividadesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'admin',
        element: <AdminPage />,
      },
      {
        path: 'planificaciones',
        element: <PlanificacionesPage />,
      },
      {
        path: 'planificaciones/:planificacionId/destinos',
        element: <DestinosPage />,
      },
      {
        path: 'destinos/:destinoId/actividades',
        element: <ActividadesPage />,
      },
    ],
  },
]);