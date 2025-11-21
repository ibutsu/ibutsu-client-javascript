import {
  type ArtifactList,
  ArtifactListFromJSON,
  ArtifactListToJSON,
  instanceOfArtifactList,
} from '../ArtifactList';

describe('ArtifactList Model', () => {
  describe('interface and types', () => {
    it('should create a valid ArtifactList object with all fields', () => {
      const artifactList: ArtifactList = {
        artifacts: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            filename: 'test.log',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      expect(artifactList.artifacts).toHaveLength(1);
      expect(artifactList.pagination?.page).toBe(1);
    });

    it('should create an ArtifactList object with minimal fields', () => {
      const artifactList: ArtifactList = {
        artifacts: [],
      };

      expect(artifactList.artifacts).toEqual([]);
      expect(artifactList.pagination).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const artifactList: ArtifactList = {
        artifacts: undefined,
        pagination: undefined,
      };

      expect(artifactList.artifacts).toBeUndefined();
      expect(artifactList.pagination).toBeUndefined();
    });
  });

  describe('ArtifactListFromJSON', () => {
    it('should convert JSON to ArtifactList object', () => {
      const json = {
        artifacts: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            filename: 'test.log',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const artifactList = ArtifactListFromJSON(json);

      expect(artifactList.artifacts).toHaveLength(1);
      expect(artifactList.pagination?.page).toBe(1);
      expect(artifactList.pagination?.pageSize).toBe(25);
    });

    it('should handle null values correctly', () => {
      const json = {
        artifacts: null,
        pagination: null,
      };

      const artifactList = ArtifactListFromJSON(json);

      expect(artifactList.artifacts).toBeUndefined();
      expect(artifactList.pagination).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {};

      const artifactList = ArtifactListFromJSON(json);

      expect(artifactList.artifacts).toBeUndefined();
      expect(artifactList.pagination).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = ArtifactListFromJSON(null);
      expect(result).toBeNull();
    });
  });

  describe('ArtifactListToJSON', () => {
    it('should convert ArtifactList object to JSON', () => {
      const artifactList: ArtifactList = {
        artifacts: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            filename: 'test.log',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = ArtifactListToJSON(artifactList);

      expect(json.artifacts).toHaveLength(1);
      expect(json.pagination.page).toBe(1);
    });

    it('should handle undefined fields', () => {
      const artifactList: ArtifactList = {
        artifacts: undefined,
      };

      const json = ArtifactListToJSON(artifactList);

      expect(json.artifacts).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = ArtifactListToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = ArtifactListToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('instanceOfArtifactList', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfArtifactList({});
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: ArtifactList = {
        artifacts: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            filename: 'test.log',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = ArtifactListToJSON(original);
      const restored = ArtifactListFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
