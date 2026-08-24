import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { AdminPage } from '../pages/AdminPage';
import { PlanificacionesPage } from '../pages/PlanificacionesPage';
import { DestinosPage } from '../pages/DestinosPage';
import { ActividadesPage } from '../pages/ActividadesPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { RoleRoute } from '../components/auth/RoleRoute';
import { GuestRoute } from '../components/auth/GuestRoute';

export const router = createBrowserRouter([
  {
    path: '/',
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