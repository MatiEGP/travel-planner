import type { UsuarioResponseDTO } from '../types/usuario';

interface UsuarioListProps {
    usuarios: UsuarioResponseDTO[];
    loading: boolean;
    error: string | null;
}

export const UsuarioList = ({ usuarios, loading, error }: UsuarioListProps) => {
    return (
        <>
            <h3 className="text-xl font-semibold mb-3">Usuarios Registrados</h3>
            {loading && <p>Cargando usuarios...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && usuarios.length === 0 && (
                <p>No hay usuarios registrados aún.</p>
            )}

            <ul className="list-disc list-inside space-y-3">
                {usuarios.map((user) => (
                    <li key={user.id}>
                        <strong>{user.nombre}</strong> ({user.email})
                        <br />
                        <small className="text-gray-500">ID: {user.id} | Registrado: {new Date(user.fechaRegistro).toLocaleDateString()}</small>
                    </li>
                ))}
            </ul>
        </>
    );
};