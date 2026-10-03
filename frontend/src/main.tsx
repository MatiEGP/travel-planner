import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './router';
// TODO: AUTH - El AuthProvider se mantiene, solo cambia su implementación interna.
import { AuthProvider } from './features/auth/context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TokenRefreshOverlay } from './shared/components/TokenRefreshOverlay';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <TokenRefreshOverlay />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
