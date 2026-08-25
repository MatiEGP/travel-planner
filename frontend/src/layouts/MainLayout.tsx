import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="flex-1 bg-slate-100 text-slate-800 flex flex-col">
      <main className="flex-1 flex flex-col relative">
        <Outlet />
      </main>
      <footer className="bg-teal-800 text-teal-200 text-center py-4 text-sm">
        <p>&copy; {new Date().getFullYear()} Travel Planner — MVP</p>
      </footer>
    </div>
  );
};