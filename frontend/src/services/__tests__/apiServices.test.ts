import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../../api/client';
import { authService } from '../authService';
import { planificacionService } from '../planificacionService';
import { destinoService } from '../destinoService';
import { actividadService } from '../actividadService';
import { usuarioService } from '../usuarioService';

vi.mock('../../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authService', () => {
    it('calls POST /auth/login with credentials', async () => {
      const mockUser = { id: 1, nombre: 'Test', email: 'test@example.com', roles: ['ROLE_CLIENT'] };
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockUser });

      const result = await authService.login({ email: 'test@example.com', password: 'password123' });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockUser);
    });

    it('calls GET /auth/me to fetch session', async () => {
      const mockUser = { id: 1, nombre: 'Test', email: 'test@example.com', roles: ['ROLE_CLIENT'] };
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockUser });

      const result = await authService.getMe();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });

    it('calls POST /auth/logout', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({});

      await authService.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('planificacionService', () => {
    it('calls GET /planificaciones/usuario/:id', async () => {
      const mockList = [{ id: 1, titulo: 'Viaje a Roma', descripcion: 'Vacaciones', fechaInicio: '2026-09-01', fechaFin: '2026-09-10' }];
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockList });

      const result = await planificacionService.getByUsuario(1);

      expect(apiClient.get).toHaveBeenCalledWith('/planificaciones/usuario/1');
      expect(result).toEqual(mockList);
    });

    it('calls POST /planificaciones', async () => {
      const newPlan = { usuarioId: 1, titulo: 'Alpes', descripcion: 'Ski', fechaInicio: '2026-12-01', fechaFin: '2026-12-10' };
      const savedPlan = { id: 2, ...newPlan };
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: savedPlan });

      const result = await planificacionService.create(newPlan);

      expect(apiClient.post).toHaveBeenCalledWith('/planificaciones', newPlan);
      expect(result).toEqual(savedPlan);
    });

    it('calls DELETE /planificaciones/:id', async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({});

      await planificacionService.delete(2);

      expect(apiClient.delete).toHaveBeenCalledWith('/planificaciones/2');
    });
  });

  describe('destinoService', () => {
    it('calls GET /destinos/planificacion/:id', async () => {
      const mockDestinos = [{ id: 1, nombre: 'Roma', pais: 'Italia', ciudad: 'Roma', notas: 'Pizzas' }];
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockDestinos });

      const result = await destinoService.getByPlanificacion(10);

      expect(apiClient.get).toHaveBeenCalledWith('/destinos/planificacion/10');
      expect(result).toEqual(mockDestinos);
    });

    it('calls POST /destinos', async () => {
      const newDestino = { planificacionId: 10, nombre: 'Florencia', pais: 'Italia', ciudad: 'Florencia', notas: 'Arte' };
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { id: 2, ...newDestino } });

      const result = await destinoService.create(newDestino);

      expect(apiClient.post).toHaveBeenCalledWith('/destinos', newDestino);
      expect(result.id).toBe(2);
    });
  });

  describe('actividadService', () => {
    it('calls GET /actividades/destino/:id', async () => {
      const mockActividades = [{ id: 1, nombre: 'Coliseo', fechaHora: '2026-09-02T10:00:00', notas: 'Guía' }];
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockActividades });

      const result = await actividadService.getByDestino(5);

      expect(apiClient.get).toHaveBeenCalledWith('/actividades/destino/5');
      expect(result).toEqual(mockActividades);
    });
  });

  describe('usuarioService', () => {
    it('calls GET /usuarios to list all users', async () => {
      const mockUsers = [{ id: 1, nombre: 'Admin', email: 'admin@example.com', roles: ['ROLE_ADMIN'], fechaRegistro: '2026-01-01' }];
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockUsers });

      const result = await usuarioService.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/usuarios');
      expect(result).toEqual(mockUsers);
    });
  });
});
