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
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await usuarioService.create(formData);
      setFormData({ nombre: '', email: '', password: '' });
      onUserCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Registrar Nuevo Usuario</h3>
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="usuario-nombre" className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo</label>
          <input
            id="usuario-nombre"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800 placeholder-slate-400"
          />
        </div>
        <div>
          <label htmlFor="usuario-email" className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
          <input
            id="usuario-email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800 placeholder-slate-400"
          />
        </div>
        <div>
          <label htmlFor="usuario-password" className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
          <input
            id="usuario-password"
            type="password"
            placeholder="Contraseña temporal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-white text-slate-800 placeholder-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Registrando...' : 'Registrar Usuario'}
        </button>
      </form>
    </div>
  );
};