import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../../../shared/api/client';
import { itinerarioService } from './itinerarioService';

vi.mock('../../../shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('itinerarioService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls GET /itinerarios/planificacion/:planificacionId/dias', async () => {
    const mockDias = [{ id: 1, planificacionId: 10, fecha: '2026-09-01', items: [] }];
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockDias });

    const result = await itinerarioService.getDiasByPlanificacion(10);
    expect(apiClient.get).toHaveBeenCalledWith('/itinerarios/planificacion/10/dias', undefined);
    expect(result).toEqual(mockDias);
  });

  it('calls POST /itinerarios/dias', async () => {
    const request = { planificacionId: 10, fecha: '2026-09-02' };
    const response = { id: 2, planificacionId: 10, fecha: '2026-09-02', items: [] };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: response });

    const result = await itinerarioService.createDia(request);
    expect(apiClient.post).toHaveBeenCalledWith('/itinerarios/dias', request, undefined);
    expect(result).toEqual(response);
  });

  it('calls DELETE /itinerarios/dias/:id', async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce({});

    await itinerarioService.deleteDia(2);
    expect(apiClient.delete).toHaveBeenCalledWith('/itinerarios/dias/2', undefined);
  });

  it('calls POST /itinerarios/items', async () => {
    const itemReq = { diaItinerarioId: 2, tipo: 'VISITA', notas: 'Paseo', horaInicio: '10:00', horaFin: '12:00' };
    const itemRes = { id: 100, ...itemReq };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: itemRes });

    const result = await itinerarioService.createItem(itemReq);
    expect(apiClient.post).toHaveBeenCalledWith('/itinerarios/items', itemReq, undefined);
    expect(result).toEqual(itemRes);
  });

  it('calls DELETE /itinerarios/items/:id', async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce({});

    await itinerarioService.deleteItem(100);
    expect(apiClient.delete).toHaveBeenCalledWith('/itinerarios/items/100', undefined);
  });
});
