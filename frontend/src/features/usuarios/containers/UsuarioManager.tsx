import { useState, useEffect, useCallback } from 'react';
import { usuarioService } from '../api/usuarioService';
import type { UsuarioResponseDTO } from '../types/usuario';
import { UsuarioForm } from '../components/UsuarioForm';
import { UsuarioList } from '../components/UsuarioList';

export const UsuarioManager = () => {
  const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await usuarioService.getAll();
        if (!cancelled) {
          setUsuarios(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Gestión de Usuarios</h2>
        <p className="text-slate-500">Registrá y gestioná los usuarios de la plataforma.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <UsuarioForm onUserCreated={refresh} />
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Usuarios Registrados ({usuarios.length})</h3>
          <UsuarioList usuarios={usuarios} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};