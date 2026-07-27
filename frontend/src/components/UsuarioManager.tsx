import { useState, useEffect, useCallback } from 'react';
import { usuarioService } from '../services/usuarioService';
import type { UsuarioResponseDTO } from '../types/usuario';
import { UsuarioForm } from './UsuarioForm';
import { UsuarioList } from './UsuarioList';

export const UsuarioManager = () => {
  const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Gestión de Usuarios</h2>
        <p className="text-slate-500">Registrá y gestioná los usuarios de la plataforma.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <UsuarioForm onUserCreated={fetchUsuarios} />
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Usuarios Registrados ({usuarios.length})</h3>
          <UsuarioList usuarios={usuarios} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};