import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './router';
// TODO: AUTH - El AuthProvider se mantiene, solo cambia su implementación interna.
import { AuthProvider } from './features/auth/context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppShell } from './shared/components/AppShell';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AppShell>
          <RouterProvider router={router} />
        </AppShell>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
