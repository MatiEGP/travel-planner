import type { UsuarioResponseDTO } from '../types/usuario';

interface UsuarioListProps {
  usuarios: UsuarioResponseDTO[];
  loading: boolean;
  error: string | null;
}

export const UsuarioList = ({ usuarios, loading, error }: UsuarioListProps) => {
  if (loading) {
    return <p className="text-slate-500 text-center py-8">Cargando usuarios...</p>;
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">
        {error}
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
        <p className="text-slate-500">No hay usuarios registrados aún.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {usuarios.map((user) => (
        <div key={user.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-700 font-bold text-sm">{user.nombre.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-slate-800 truncate">{user.nombre}</h4>
                {user.roles && user.roles.length > 0 && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    {user.roles.join(', ')}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 truncate">{user.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 mt-2">
                Registrado: {new Date(user.fechaRegistro).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};