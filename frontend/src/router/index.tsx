import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../features/planificaciones/pages/HomePage';
import { AdminPage } from '../features/usuarios/pages/AdminPage';
import { PlanificacionesPage } from '../features/planificaciones/pages/PlanificacionesPage';
import { DestinosPage } from '../features/destinos/pages/DestinosPage';
import { ActividadesPage } from '../features/actividades/pages/ActividadesPage';
import { AuthPage } from '../features/auth/pages/AuthPage';
import { ProtectedRoute } from '../features/auth/containers/ProtectedRoute';
import { RoleRoute } from '../features/auth/containers/RoleRoute';
import { GuestRoute } from '../features/auth/containers/GuestRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Standalone protected pages
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'planificaciones',
            element: <PlanificacionesPage />,
          },
        ],
      },
      // Rutas para usuarios no autenticados (invitados)
      {
        element: <GuestRoute />,
        children: [
          {
            path: 'login',
            element: <AuthPage />,
          },
          {
            path: 'register',
            element: <AuthPage />,
          },
          {
            path: 'registro',
            element: <AuthPage />,
          },
        ],
      },
      // Legacy routes wrapped in MainLayout
      {
        element: <MainLayout />,
        children: [
          // Rutas protegidas para cualquier usuario autenticado
          {
            element: <ProtectedRoute />,
            children: [
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
    ],
  },
]);