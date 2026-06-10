import { describe, test, expect, vi, beforeEach } from 'vitest';
import apiService from './api';

describe('apiService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('projects.getAll returns list of projects successfully', async () => {
    const mockProjects = [
      { id: 1, title: 'Project 1', description: 'Desc 1' },
      { id: 2, title: 'Project 2', description: 'Desc 2' }
    ];

    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockProjects
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as any);

    const result = await apiService.projects.getAll();

    expect(fetchSpy).toHaveBeenCalled();
    expect(result.data).toEqual(mockProjects);
    expect(result.error).toBeNull();
    expect(result.status).toBe(200);
  });

  test('handles HTTP error responses gracefully', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Database error'
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as any);

    const result = await apiService.projects.getAll();

    expect(result.data).toBeNull();
    expect(result.error).toContain('HTTP 500: Internal Server Error - Database error');
    expect(result.status).toBe(500);
  });
});
