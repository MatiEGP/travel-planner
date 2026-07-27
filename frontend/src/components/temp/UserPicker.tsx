// TODO: AUTH - ELIMINAR ESTE COMPONENTE COMPLETO al implementar login.
// Este componente es un reemplazo temporal del flujo de autenticación.
// Permite seleccionar manualmente un usuario existente para simular estar "logueado".

import { useState, useEffect } from 'react';
import { usuarioService } from '../../services/usuarioService';
import type { UsuarioResponseDTO } from '../../types/usuario';
import { useAuth } from '../../context/AuthContext';

export const UserPicker = () => {
  const { setUsuario } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
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
    };
    fetchUsuarios();
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selected = usuarios.find((u) => u.id === selectedId) || null;
    setUsuario(selected);
  };

  return (
    <div className="max-w-md mx-auto mt-16 text-center">
      <div className="bg-white rounded-xl shadow-md p-8">
        {/* TODO: AUTH - Este ícono/banner se reemplaza por el formulario de login */}
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Seleccionar Usuario</h2>
        <p className="text-sm text-slate-500 mb-6">
          Seleccioná un usuario para continuar. Este paso será reemplazado por el login.
        </p>

        {loading && <p className="text-slate-500 py-4">Cargando usuarios...</p>}
        {error && <p className="text-rose-500 py-4">{error}</p>}

        {!loading && !error && usuarios.length === 0 && (
          <p className="text-slate-500 py-4">No hay usuarios registrados. Creá uno desde el panel de Administración.</p>
        )}

        {!loading && !error && usuarios.length > 0 && (
          <select
            onChange={handleSelect}
            defaultValue=""
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800 cursor-pointer"
          >
            <option value="" disabled>-- Elegí un usuario --</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} ({u.email})
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};
