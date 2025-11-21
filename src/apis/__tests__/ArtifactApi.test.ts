import { ArtifactApi } from '../ArtifactApi';
import type { Artifact, ArtifactList } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('ArtifactApi', () => {
  let api: ArtifactApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new ArtifactApi(config);
  });

  describe('uploadArtifact', () => {
    it('should upload a file artifact', async () => {
      const fileContent = 'test file content';
      const fileBlob = new Blob([fileContent], { type: 'text/plain' });
      const filename = 'test.txt';

      const responseArtifact: Artifact = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        filename,
        uploadDate: '2024-01-01T00:00:00.000Z',
      };

      mockFetch = createMockFetch(responseArtifact, 201);
      global.fetch = mockFetch;

      const result = await api.uploadArtifact({
        filename,
        file: fileBlob,
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/artifact',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.filename).toBe(filename);
    });

    it('should attach artifact to a result', async () => {
      const fileBlob = new Blob(['data'], { type: 'text/plain' });
      const resultId = '123e4567-e89b-12d3-a456-426614174001';

      const responseArtifact: Artifact = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        filename: 'test.txt',
        resultId,
      };

      mockFetch = createMockFetch(responseArtifact, 201);
      global.fetch = mockFetch;

      const result = await api.uploadArtifact({
        filename: 'test.txt',
        file: fileBlob,
        resultId,
      });

      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should attach artifact to a run', async () => {
      const fileBlob = new Blob(['data'], { type: 'text/plain' });
      const runId = '123e4567-e89b-12d3-a456-426614174002';

      const responseArtifact: Artifact = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        filename: 'test.txt',
        runId,
      };

      mockFetch = createMockFetch(responseArtifact, 201);
      global.fetch = mockFetch;

      const result = await api.uploadArtifact({
        filename: 'test.txt',
        file: fileBlob,
        runId,
      });

      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should include additional metadata', async () => {
      const fileBlob = new Blob(['data'], { type: 'application/json' });
      const additionalMetadata = {
        category: 'logs',
        source: 'jenkins',
      };

      const responseArtifact: Artifact = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        filename: 'log.json',
      };

      mockFetch = createMockFetch(responseArtifact, 201);
      global.fetch = mockFetch;

      await api.uploadArtifact({
        filename: 'log.json',
        file: fileBlob,
        additionalMetadata,
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle upload errors', async () => {
      const fileBlob = new Blob(['data'], { type: 'text/plain' });

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'File too large' }, 413));
      global.fetch = mockFetch;

      await expect(
        api.uploadArtifact({
          filename: 'test.txt',
          file: fileBlob,
        })
      ).rejects.toThrow();
    });
  });

  describe('getArtifact', () => {
    it('should fetch an artifact by ID', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedArtifact: Artifact = {
        id: artifactId,
        filename: 'screenshot.png',
        uploadDate: '2024-01-01T00:00:00.000Z',
      };

      mockFetch = createMockFetch(expectedArtifact);
      global.fetch = mockFetch;

      const result = await api.getArtifact({ id: artifactId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/artifact/${artifactId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.id).toBe(artifactId);
      expect(result.filename).toBe('screenshot.png');
    });

    it('should handle 404 when artifact not found', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.getArtifact({ id: artifactId })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.getArtifact({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('getArtifactList', () => {
    it('should fetch a list of artifacts', async () => {
      const mockArtifactList: ArtifactList = {
        artifacts: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            filename: 'log.txt',
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            filename: 'screenshot.png',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 2,
          totalPages: 1,
        },
      };

      mockFetch = createMockFetch(mockArtifactList);
      global.fetch = mockFetch;

      const result = await api.getArtifactList({});

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/artifact',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.artifacts).toHaveLength(2);
    });

    it('should handle pagination parameters', async () => {
      const mockArtifactList: ArtifactList = {
        artifacts: [],
        pagination: {
          page: 2,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockArtifactList);
      global.fetch = mockFetch;

      await api.getArtifactList({ page: 2, pageSize: 10 });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('page=2');
      expect(url).toContain('pageSize=10');
    });

    it('should filter by resultId', async () => {
      const resultId = '123e4567-e89b-12d3-a456-426614174000';
      const mockArtifactList: ArtifactList = {
        artifacts: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            filename: 'test.log',
            resultId,
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      mockFetch = createMockFetch(mockArtifactList);
      global.fetch = mockFetch;

      await api.getArtifactList({ resultId });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain(`resultId=${resultId}`);
    });

    it('should filter by runId', async () => {
      const runId = '123e4567-e89b-12d3-a456-426614174000';
      const mockArtifactList: ArtifactList = {
        artifacts: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            filename: 'test.log',
            runId,
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      mockFetch = createMockFetch(mockArtifactList);
      global.fetch = mockFetch;

      await api.getArtifactList({ runId });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain(`runId=${runId}`);
    });

    it('should return empty list when no artifacts exist', async () => {
      const mockArtifactList: ArtifactList = {
        artifacts: [],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockArtifactList);
      global.fetch = mockFetch;

      const result = await api.getArtifactList({});

      expect(result.artifacts).toHaveLength(0);
    });
  });

  describe('downloadArtifact', () => {
    it('should download an artifact as Blob', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';
      const mockBlob = new Blob(['file content'], { type: 'text/plain' });

      mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        blob: async () => mockBlob,
      });
      global.fetch = mockFetch;

      const result = await api.downloadArtifact({ id: artifactId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/artifact/${artifactId}/download`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toBeInstanceOf(Blob);
    });

    it('should handle download errors', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.downloadArtifact({ id: artifactId })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.downloadArtifact({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('viewArtifact', () => {
    it('should stream an artifact as Blob', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';
      const mockBlob = new Blob(['<html>content</html>'], { type: 'text/html' });

      mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        blob: async () => mockBlob,
      });
      global.fetch = mockFetch;

      const result = await api.viewArtifact({ id: artifactId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/artifact/${artifactId}/view`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toBeInstanceOf(Blob);
    });

    it('should handle viewing errors', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Forbidden' }, 403));
      global.fetch = mockFetch;

      await expect(api.viewArtifact({ id: artifactId })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.viewArtifact({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('deleteArtifact', () => {
    it('should delete an artifact', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';

      mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 204,
      });
      global.fetch = mockFetch;

      await api.deleteArtifact({ id: artifactId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/artifact/${artifactId}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should handle delete errors', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Forbidden' }, 403));
      global.fetch = mockFetch;

      await expect(api.deleteArtifact({ id: artifactId })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.deleteArtifact({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token-456',
      });
      api = new ArtifactApi(config);

      const artifactId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedArtifact: Artifact = {
        id: artifactId,
        filename: 'test.txt',
      };

      mockFetch = createMockFetch(expectedArtifact);
      global.fetch = mockFetch;

      await api.getArtifact({ id: artifactId });

      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining<Partial<FetchOptions>>({
          headers: expect.objectContaining<Record<string, string>>({
            Authorization: 'Bearer test-token-456',
          }),
        })
      );
    });

    it('should work without authentication when not configured', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedArtifact: Artifact = {
        id: artifactId,
        filename: 'test.txt',
      };

      mockFetch = createMockFetch(expectedArtifact);
      global.fetch = mockFetch;

      await api.getArtifact({ id: artifactId });

      const callArgs = mockFetch.mock.calls[0][1] as RequestInit;
      const headers = callArgs.headers as Record<string, string>;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should handle 400 Bad Request errors', async () => {
      const fileBlob = new Blob(['data'], { type: 'text/plain' });
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(
        api.uploadArtifact({
          filename: 'test.txt',
          file: fileBlob,
        })
      ).rejects.toThrow();
    });

    it('should handle 401 Unauthorized errors', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Unauthorized' }, 401));
      global.fetch = mockFetch;

      await expect(api.getArtifact({ id: artifactId })).rejects.toThrow();
    });

    it('should handle 403 Forbidden errors', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Forbidden' }, 403));
      global.fetch = mockFetch;

      await expect(api.deleteArtifact({ id: artifactId })).rejects.toThrow();
    });

    it('should handle 404 Not Found errors', async () => {
      const artifactId = '123e4567-e89b-12d3-a456-426614174000';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.getArtifact({ id: artifactId })).rejects.toThrow();
    });

    it('should handle 500 Internal Server Error', async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue(createMockResponse({ error: 'Internal Server Error' }, 500));
      global.fetch = mockFetch;

      await expect(api.getArtifactList({})).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      await expect(api.getArtifactList({})).rejects.toThrow();
    });
  });
});
