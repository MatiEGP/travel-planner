import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../features/planificaciones/pages/HomePage';
import { AdminPage } from '../features/usuarios/pages/AdminPage';
import { PlanificacionesPage } from '../features/planificaciones/pages/PlanificacionesPage';
import { DestinosPage } from '../features/destinos/pages/DestinosPage';
import { ActividadesPage } from '../features/actividades/pages/ActividadesPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ProtectedRoute } from '../features/auth/containers/ProtectedRoute';
import { RoleRoute } from '../features/auth/containers/RoleRoute';
import { GuestRoute } from '../features/auth/containers/GuestRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Rutas para usuarios no autenticados (invitados)
      {
        element: <GuestRoute />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },
          {
            path: 'registro',
            element: <RegisterPage />,
          },
        ],
      },
      // Rutas protegidas para cualquier usuario autenticado
      {
        element: <ProtectedRoute />,
        children: [
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
          // Rutas exclusivas para administradores
          {
            element: <RoleRoute requiredRole="ADMIN" />,
            children: [
              {
                path: 'admin',
                element: <AdminPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);