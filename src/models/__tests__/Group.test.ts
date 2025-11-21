import { type Group, GroupFromJSON, GroupToJSON, instanceOfGroup } from '../Group';

describe('Group Model', () => {
  describe('interface and types', () => {
    it('should create a valid Group object with all fields', () => {
      const group: Group = {
        id: 'group-123',
        name: 'engineering-team',
      };

      expect(group.id).toBe('group-123');
      expect(group.name).toBe('engineering-team');
    });

    it('should create a Group object with minimal fields', () => {
      const group: Group = {
        name: 'qa-team',
      };

      expect(group.name).toBe('qa-team');
      expect(group.id).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const group: Group = {
        id: undefined,
        name: 'test-team',
      };

      expect(group.id).toBeUndefined();
    });
  });

  describe('GroupFromJSON', () => {
    it('should convert JSON to Group object', () => {
      const json = {
        id: 'group-456',
        name: 'dev-team',
      };

      const group = GroupFromJSON(json);

      expect(group.id).toBe('group-456');
      expect(group.name).toBe('dev-team');
    });

    it('should handle null values correctly', () => {
      const json = {
        id: null,
        name: 'test',
      };

      const group = GroupFromJSON(json);

      expect(group.id).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {
        name: 'team',
      };

      const group = GroupFromJSON(json);

      expect(group.name).toBe('team');
      expect(group.id).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = GroupFromJSON(null);
      expect(result).toBeNull();
    });
  });

  describe('GroupToJSON', () => {
    it('should convert Group object to JSON', () => {
      const group: Group = {
        id: 'group-789',
        name: 'ops-team',
      };

      const json = GroupToJSON(group);

      expect(json.id).toBe('group-789');
      expect(json.name).toBe('ops-team');
    });

    it('should handle undefined fields', () => {
      const group: Group = {
        name: 'test',
      };

      const json = GroupToJSON(group);

      expect(json.name).toBe('test');
      expect(json.id).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = GroupToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = GroupToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('instanceOfGroup', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfGroup({});
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: Group = {
        id: 'group-999',
        name: 'test-group',
      };

      const json = GroupToJSON(original);
      const restored = GroupFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
