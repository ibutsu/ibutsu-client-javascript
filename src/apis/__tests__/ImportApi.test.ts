import { ImportApi } from '../ImportApi';
import type { Import } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('ImportApi', () => {
  let api: ImportApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new ImportApi(config);
  });

  describe('addImport', () => {
    it('should upload an import file', async () => {
      const mockFile = new Blob(['content'], { type: 'application/xml' });
      const responseImport: Import = {
        id: 'import-123',
        status: 'pending',
      };

      mockFetch = createMockFetch(responseImport, 201);
      global.fetch = mockFetch;

      const result = await api.addImport({
        importFile: mockFile,
        project: 'project-1',
        source: 'archive',
        metadata: { key: 'value' },
      });

      expect(result).toEqual(responseImport);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0]).toBe('http://localhost/api/import');
      expect(callArgs[1].method).toBe('POST');

      // Verify FormData
      const formData = callArgs[1].body;
      expect(formData).toBeInstanceOf(FormData);
      // We can't easily inspect FormData content in JSDOM environment without further mocking
      // but we verified it's the correct type being sent
    });

    it('should require importFile parameter', async () => {
      await expect(api.addImport({ importFile: null as unknown as Blob })).rejects.toThrow();
    });

    it('should handle upload errors', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Upload Failed' }, 500));
      global.fetch = mockFetch;

      await expect(api.addImport({ importFile: new Blob([]) })).rejects.toThrow();
    });
  });

  describe('getImport', () => {
    it('should fetch an import by ID', async () => {
      const importId = 'import-123';
      const expectedImport: Import = {
        id: importId,
        status: 'done',
      };

      mockFetch = createMockFetch(expectedImport);
      global.fetch = mockFetch;

      const result = await api.getImport({ id: importId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/import/${importId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.id).toBe(importId);
      expect(result.status).toBe('done');
    });

    it('should handle 404 when import not found', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;
      await expect(api.getImport({ id: 'missing' })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.getImport({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token',
      });
      api = new ImportApi(config);

      // Mock fetch for getImport
      mockFetch = createMockFetch({});
      global.fetch = mockFetch;

      await api.getImport({ id: '1' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });
  });
});
