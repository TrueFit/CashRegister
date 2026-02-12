/**
 * API Service for handling REST API calls
 * Supports GET, POST, PUT, and DELETE requests
 */

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5079/api';

/**
 * Generic function to make API requests
 */
async function makeRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const isFormData = options?.body instanceof FormData;
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...options.headers,
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (options.body && (method === 'POST' || method === 'PUT')) {
      config.body = isFormData ? options.body : JSON.stringify(options.body)
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      return {
        data: null,
        error: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    const data = await response.json();
    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 0,
    };
  }
}

/**
 * GET request
 */
export async function apiGet<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return makeRequest<T>(endpoint, 'GET', options);
}

/**
 * POST request
 */
export async function apiPost<T>(
  endpoint: string,
  body: any,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return makeRequest<T>(endpoint, 'POST', { ...options, body });
}

/**
 * PUT request
 */
export async function apiPut<T>(
  endpoint: string,
  body: any,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return makeRequest<T>(endpoint, 'PUT', { ...options, body });
}

/**
 * DELETE request
 */
export async function apiDelete<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return makeRequest<T>(endpoint, 'DELETE', options);
}

export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
};
