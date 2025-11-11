import calculateWorkerToJobDistance from '../calculateWorkerToJobDistance';

// These do not test the API themselves rather the Haversine implementation that takes coordinates and calculates distance.
// Hence the API is mocked.

jest.mock('../../config', () => ({
  API_BASE_URL: 'https://mock-api.test',
  WORKER_ID: 'mock-worker-id',
  LOCATION_IQ_ACCESS_TOKEN: 'mock-token',
}));

describe('calculateWorkerToJobDistance', () => {
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeAll(() => {
    mockFetch = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
    globalThis.fetch = mockFetch;
  });

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns null if worker or job address is missing', async () => {
    expect(await calculateWorkerToJobDistance(undefined, '123 Main St')).toBeNull();
    expect(await calculateWorkerToJobDistance('123 Main St', undefined)).toBeNull();
  });

  it('calculates distance correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      // The White House
      json: async () => [{ lat: '38.8977', lon: '-77.0365' }],
    } as Response);
    mockFetch.mockResolvedValueOnce({
      // Golden Gate Bridge
      json: async () => [{ lat: '37.8199', lon: '-122.4783' }],
    } as Response);

    const distance = await calculateWorkerToJobDistance('The White House, Washington D.C.', 'Golden Gate Bridge, San Francisco, CA');

    // Should be approx 3920 Km.

    expect(Number(distance)).toBeGreaterThan(3800);
    expect(Number(distance)).toBeLessThan(4000);
  });

  it('calculates distance correctly for short-to-medium sites', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => [{ lat: '34.0736', lon: '-118.2401' }],
    } as Response);
    mockFetch.mockResolvedValueOnce({
      json: async () => [{ lat: '33.9535', lon: '-118.3377' }],
    } as Response);

    const distance = await calculateWorkerToJobDistance('Dodger Stadium, Los Angeles, CA', 'SoFi Stadium, Inglewood, CA');

    // Assert the distance is close to the known value of 16 km
    expect(Number(distance)).toBeGreaterThan(15);
    expect(Number(distance)).toBeLessThan(17);
  });

  it('returns null on API error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('API error'));
    const result = await calculateWorkerToJobDistance('123 Main St', '456 Elm St');
    expect(result).toBeNull();
    consoleSpy.mockRestore();
  });
});
