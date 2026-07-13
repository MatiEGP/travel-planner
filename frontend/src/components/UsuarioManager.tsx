import { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import type { UsuarioResponseDTO } from '../types/usuario';
import { UsuarioForm } from './UsuarioForm';
import { UsuarioList } from './UsuarioList';

export const UsuarioManager = () => {
    // Estados para almacenar datos y controlar la interfaz
    const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar los usuarios al montar el componente
    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const data = await usuarioService.getAll();
            setUsuarios(data);
            setError(null);
        } catch (err) { // El error ya viene procesado por el interceptor de Axios
            const errorMessage = (err as Error).message;
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-5 font-sans">
            <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios - MVP</h2>

            {/* Formulario de Creación */}
            <UsuarioForm onUserCreated={fetchUsuarios} />

            <hr className="my-6" />

            {/* Lista de Usuarios */}
            <UsuarioList usuarios={usuarios} loading={loading} error={error} />
        </div>
    );
};