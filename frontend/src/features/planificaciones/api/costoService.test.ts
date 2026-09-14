import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../../../shared/api/client';
import { costoService } from './costoService';

vi.mock('../../../shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('costoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls GET /costos/planificacion/:planificacionId', async () => {
    const mockCostos = [
      { id: 1, planificacionId: 5, categoria: 'Hospedaje', monto: 250, descripcion: 'Hotel París' },
    ];
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockCostos });

    const result = await costoService.getByPlanificacion(5);
    expect(apiClient.get).toHaveBeenCalledWith('/costos/planificacion/5');
    expect(result).toEqual(mockCostos);
  });

  it('calls GET /costos/:id', async () => {
    const mockCosto = { id: 1, planificacionId: 5, categoria: 'Hospedaje', monto: 250, descripcion: 'Hotel París' };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockCosto });

    const result = await costoService.getById(1);
    expect(apiClient.get).toHaveBeenCalledWith('/costos/1');
    expect(result).toEqual(mockCosto);
  });

  it('calls POST /costos', async () => {
    const req = { planificacionId: 5, categoria: 'Comida', monto: 60, descripcion: 'Cena bistro' };
    const res = { id: 2, ...req };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: res });

    const result = await costoService.create(req);
    expect(apiClient.post).toHaveBeenCalledWith('/costos', req);
    expect(result).toEqual(res);
  });

  it('calls DELETE /costos/:id', async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce({});

    await costoService.delete(2);
    expect(apiClient.delete).toHaveBeenCalledWith('/costos/2');
  });
});
