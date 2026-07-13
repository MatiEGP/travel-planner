import { Outlet } from "react-router-dom";
import { Header } from "../components/layout/Header";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main>
        <Outlet /> {/* Las páginas hijas se renderizarán aquí */}
      </main>
    </div>
  );
};