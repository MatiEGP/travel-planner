import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { HomePage } from "../pages/HomePage";
import { AdminPage } from "../pages/AdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // El Layout envuelve a todas las páginas hijas
    children: [
      {
        index: true, // Esta es la ruta por defecto (equivale a path: "/")
        element: <HomePage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
    ],
  },
]);