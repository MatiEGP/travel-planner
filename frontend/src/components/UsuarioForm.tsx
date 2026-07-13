import { useState, type FormEvent } from 'react';
import { usuarioService } from '../services/usuarioService';
import type { UsuarioRequestDTO } from '../types/usuario';

interface UsuarioFormProps {
    onUserCreated: () => void;
}

export const UsuarioForm = ({ onUserCreated }: UsuarioFormProps) => {
    const [formData, setFormData] = useState<UsuarioRequestDTO>({
        nombre: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await usuarioService.create(formData);
            alert('¡Usuario creado con éxito!');
            setFormData({ nombre: '', email: '', password: '' }); // Limpiamos el formulario
            onUserCreated(); // Notificamos al componente padre para que recargue la lista
        } catch (err) {
            // Gracias al interceptor, 'err' es un objeto Error con el mensaje del backend.
            alert((err as Error).message);
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
            <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                className="p-2 border border-gray-300 rounded-md"
            />
            <input
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="p-2 border border-gray-300 rounded-md"
            />
            <input
                type="password"
                placeholder="Contraseña temporal"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="p-2 border border-gray-300 rounded-md"
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
                Registrar Usuario
            </button>
        </form>
    );
};