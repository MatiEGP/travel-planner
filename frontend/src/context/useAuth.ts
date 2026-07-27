import { useContext } from 'react';
import { AuthContext } from './authContextDef';
import type { AuthContextType } from './authContextDef';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
