import { itinerarioService } from './itinerarioService';

describe('itinerarioService', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches itinerario data successfully', async () => {
    const mockData = [{ id: '1', fecha: '2023-01-01', items: [] }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await itinerarioService.getItinerario('plan1');
    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/planificaciones/plan1/itinerario'));
  });

  it('throws an error if fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found'
    });

    await expect(itinerarioService.getItinerario('plan2')).rejects.toThrow('Failed to fetch itinerario: Not Found');
  });
});
