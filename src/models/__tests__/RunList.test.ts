import { type RunList, RunListFromJSON, RunListToJSON, instanceOfRunList } from '../RunList';

describe('RunList Model', () => {
  describe('interface and types', () => {
    it('should create a valid RunList object with all fields', () => {
      const runList: RunList = {
        runs: [
          {
            id: 'run-123',
            metadata: { project: 'test' },
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      expect(runList.runs).toHaveLength(1);
      expect(runList.pagination?.page).toBe(1);
    });

    it('should create a RunList object with minimal fields', () => {
      const runList: RunList = {
        runs: [],
      };

      expect(runList.runs).toEqual([]);
      expect(runList.pagination).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const runList: RunList = {
        runs: undefined,
        pagination: undefined,
      };

      expect(runList.runs).toBeUndefined();
      expect(runList.pagination).toBeUndefined();
    });
  });

  describe('RunListFromJSON', () => {
    it('should convert JSON to RunList object', () => {
      const json = {
        runs: [
          {
            id: 'run-123',
            metadata: { project: 'test' },
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const runList = RunListFromJSON(json);

      expect(runList.runs).toHaveLength(1);
      expect(runList.pagination?.page).toBe(1);
      expect(runList.pagination?.pageSize).toBe(25);
    });

    it('should handle null values correctly', () => {
      const json = {
        runs: null,
        pagination: null,
      };

      const runList = RunListFromJSON(json);

      expect(runList.runs).toBeUndefined();
      expect(runList.pagination).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {};

      const runList = RunListFromJSON(json);

      expect(runList.runs).toBeUndefined();
      expect(runList.pagination).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = RunListFromJSON(null);
      expect(result).toBeNull();
    });
  });

  describe('RunListToJSON', () => {
    it('should convert RunList object to JSON', () => {
      const runList: RunList = {
        runs: [
          {
            id: 'run-123',
            metadata: { project: 'test' },
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = RunListToJSON(runList);

      expect(json.runs).toHaveLength(1);
      expect(json.pagination.page).toBe(1);
    });

    it('should handle undefined fields', () => {
      const runList: RunList = {
        runs: undefined,
      };

      const json = RunListToJSON(runList);

      expect(json.runs).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = RunListToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = RunListToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('instanceOfRunList', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfRunList({});
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: RunList = {
        runs: [
          {
            id: 'run-123',
            metadata: { project: 'test' },
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = RunListToJSON(original);
      const restored = RunListFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
