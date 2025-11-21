import { type Artifact, ArtifactFromJSON, ArtifactToJSON, instanceOfArtifact } from '../Artifact';

describe('Artifact Model', () => {
  describe('interface and types', () => {
    it('should create a valid Artifact object with all fields', () => {
      const artifact: Artifact = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        filename: 'test-artifact.log',
        uploadDate: '2024-01-01T00:00:00.000Z',
        resultId: '123e4567-e89b-12d3-a456-426614174001',
        runId: '123e4567-e89b-12d3-a456-426614174002',
      };

      expect(artifact.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(artifact.filename).toBe('test-artifact.log');
      expect(artifact.uploadDate).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should create an Artifact object with minimal fields', () => {
      const artifact: Artifact = {
        filename: 'test.txt',
      };

      expect(artifact.filename).toBe('test.txt');
      expect(artifact.id).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const artifact: Artifact = {
        id: undefined,
        filename: 'test.log',
        uploadDate: undefined,
      };

      expect(artifact.id).toBeUndefined();
      expect(artifact.uploadDate).toBeUndefined();
    });
  });

  describe('ArtifactFromJSON', () => {
    it('should convert JSON with snake_case to Artifact object with camelCase', () => {
      const json = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        filename: 'artifact.png',
        upload_date: '2024-01-01T00:00:00.000Z',
        result_id: '123e4567-e89b-12d3-a456-426614174001',
        run_id: '123e4567-e89b-12d3-a456-426614174002',
      };

      const artifact = ArtifactFromJSON(json);

      expect(artifact.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(artifact.filename).toBe('artifact.png');
      expect(artifact.uploadDate).toBe('2024-01-01T00:00:00.000Z');
      expect(artifact.resultId).toBe('123e4567-e89b-12d3-a456-426614174001');
      expect(artifact.runId).toBe('123e4567-e89b-12d3-a456-426614174002');
    });

    it('should handle null values correctly', () => {
      const json = {
        filename: 'test.txt',
        upload_date: null,
      };

      const artifact = ArtifactFromJSON(json);

      expect(artifact.uploadDate).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {
        filename: 'test.log',
      };

      const artifact = ArtifactFromJSON(json);

      expect(artifact.filename).toBe('test.log');
      expect(artifact.id).toBeUndefined();
      expect(artifact.uploadDate).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = ArtifactFromJSON(null);
      expect(result).toBeNull();
    });
  });

  describe('ArtifactToJSON', () => {
    it('should convert Artifact object with camelCase to JSON with snake_case', () => {
      const artifact: Artifact = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        filename: 'test.log',
        uploadDate: '2024-01-01T00:00:00.000Z',
        resultId: '123e4567-e89b-12d3-a456-426614174001',
        runId: '123e4567-e89b-12d3-a456-426614174002',
      };

      const json = ArtifactToJSON(artifact);

      expect(json.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(json.filename).toBe('test.log');
      expect(json.upload_date).toBe('2024-01-01T00:00:00.000Z');
      expect(json.result_id).toBe('123e4567-e89b-12d3-a456-426614174001');
      expect(json.run_id).toBe('123e4567-e89b-12d3-a456-426614174002');
    });

    it('should handle undefined fields', () => {
      const artifact: Artifact = {
        filename: 'test.txt',
      };

      const json = ArtifactToJSON(artifact);

      expect(json.filename).toBe('test.txt');
      expect(json.id).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = ArtifactToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = ArtifactToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('instanceOfArtifact', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfArtifact({});
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: Artifact = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        filename: 'screenshot.png',
        uploadDate: '2024-01-01T00:00:00.000Z',
        resultId: '123e4567-e89b-12d3-a456-426614174001',
      };

      const json = ArtifactToJSON(original);
      const restored = ArtifactFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
