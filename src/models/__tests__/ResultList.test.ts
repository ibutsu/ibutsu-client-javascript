import {
  type ResultList,
  ResultListFromJSON,
  ResultListToJSON,
  instanceOfResultList,
} from '../ResultList';

describe('ResultList Model', () => {
  describe('interface and types', () => {
    it('should create a valid ResultList object with all fields', () => {
      const resultList: ResultList = {
        results: [
          {
            id: 'result-123',
            metadata: { test: 'value' },
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      expect(resultList.results).toHaveLength(1);
      expect(resultList.pagination?.page).toBe(1);
    });

    it('should create a ResultList object with minimal fields', () => {
      const resultList: ResultList = {
        results: [],
      };

      expect(resultList.results).toEqual([]);
      expect(resultList.pagination).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const resultList: ResultList = {
        results: undefined,
        pagination: undefined,
      };

      expect(resultList.results).toBeUndefined();
      expect(resultList.pagination).toBeUndefined();
    });
  });

  describe('ResultListFromJSON', () => {
    it('should convert JSON to ResultList object', () => {
      const json = {
        results: [
          {
            id: 'result-123',
            metadata: { test: 'value' },
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const resultList = ResultListFromJSON(json);

      expect(resultList.results).toHaveLength(1);
      expect(resultList.pagination?.page).toBe(1);
      expect(resultList.pagination?.pageSize).toBe(25);
    });

    it('should handle null values correctly', () => {
      const json = {
        results: null,
        pagination: null,
      };

      const resultList = ResultListFromJSON(json);

      expect(resultList.results).toBeUndefined();
      expect(resultList.pagination).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {};

      const resultList = ResultListFromJSON(json);

      expect(resultList.results).toBeUndefined();
      expect(resultList.pagination).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = ResultListFromJSON(null);
      expect(result).toBeNull();
    });
  });

  describe('ResultListToJSON', () => {
    it('should convert ResultList object to JSON', () => {
      const resultList: ResultList = {
        results: [
          {
            id: 'result-123',
            metadata: { test: 'value' },
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = ResultListToJSON(resultList);

      expect(json.results).toHaveLength(1);
      expect(json.pagination.page).toBe(1);
    });

    it('should handle undefined fields', () => {
      const resultList: ResultList = {
        results: undefined,
      };

      const json = ResultListToJSON(resultList);

      expect(json.results).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = ResultListToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = ResultListToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('instanceOfResultList', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfResultList({});
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: ResultList = {
        results: [
          {
            id: 'result-123',
            metadata: { test: 'value' },
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = ResultListToJSON(original);
      const restored = ResultListFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
