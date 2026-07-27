import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-teal-800 text-teal-200 text-center py-4 text-sm">
        <p>&copy; {new Date().getFullYear()} Travel Planner — MVP</p>
      </footer>
    </div>
  );
};