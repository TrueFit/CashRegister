import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiGet, apiPost, apiPut, apiDelete } from './BackendService';

describe('API Service', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    globalThis.fetch = mockFetch as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('apiGet should call fetch with GET', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ test: 'data' }),
    });

    const response = await apiGet('/test');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'GET',
      })
    );

    expect(response.data).toEqual({ test: 'data' });
    expect(response.error).toBeNull();
    expect(response.status).toBe(200);
  });

  it('apiPost should send JSON body correctly', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ success: true }),
    });

    const body = { name: 'John' };
    const response = await apiPost('/users', body);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(body),
      })
    );

    expect(response.data).toEqual({ success: true });
  });

  it('apiPost should send FormData without Content-Type header', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ uploaded: true }),
    });

    const formData = new FormData();
    formData.append('file', new Blob(['test']), 'test.txt');

    await apiPost('/upload', formData);

    const callArgs = mockFetch.mock.calls[0][1];

    expect(callArgs.method).toBe('POST');
    expect(callArgs.body).toBe(formData);

    // Ensure Content-Type was NOT manually set
    expect(callArgs.headers['Content-Type']).toBeUndefined();
  });

  it('should return error for non-OK response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    });

    const response = await apiGet('/bad');

    expect(response.data).toBeNull();
    expect(response.error).toBe('HTTP 400: Bad Request');
    expect(response.status).toBe(400);
  });

  it('should return error for network failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network down'));

    const response = await apiGet('/fail');

    expect(response.data).toBeNull();
    expect(response.error).toBe('Network down');
    expect(response.status).toBe(0);
  });

  it('apiPut should call fetch with PUT', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ updated: true }),
    });

    const response = await apiPut('/update', { id: 1 });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'PUT',
      })
    );

    expect(response.data).toEqual({ updated: true });
  });

  it('apiDelete should call fetch with DELETE', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 204,
      json: async () => ({}),
    });

    const response = await apiDelete('/delete');

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'DELETE',
      })
    );

    expect(response.status).toBe(204);
  });
});
