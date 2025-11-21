import {
  type GroupList,
  GroupListFromJSON,
  GroupListToJSON,
  instanceOfGroupList,
} from '../GroupList';

describe('GroupList Model', () => {
  describe('interface and types', () => {
    it('should create a valid GroupList object with all fields', () => {
      const groupList: GroupList = {
        groups: [
          {
            id: 'group-123',
            name: 'test-group',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      expect(groupList.groups).toHaveLength(1);
      expect(groupList.pagination?.page).toBe(1);
    });

    it('should create a GroupList object with minimal fields', () => {
      const groupList: GroupList = {
        groups: [],
      };

      expect(groupList.groups).toEqual([]);
      expect(groupList.pagination).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const groupList: GroupList = {
        groups: undefined,
        pagination: undefined,
      };

      expect(groupList.groups).toBeUndefined();
      expect(groupList.pagination).toBeUndefined();
    });
  });

  describe('GroupListFromJSON', () => {
    it('should convert JSON to GroupList object', () => {
      const json = {
        groups: [
          {
            id: 'group-123',
            name: 'test-group',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const groupList = GroupListFromJSON(json);

      expect(groupList.groups).toHaveLength(1);
      expect(groupList.pagination?.page).toBe(1);
      expect(groupList.pagination?.pageSize).toBe(25);
    });

    it('should handle null values correctly', () => {
      const json = {
        groups: null,
        pagination: null,
      };

      const groupList = GroupListFromJSON(json);

      expect(groupList.groups).toBeUndefined();
      expect(groupList.pagination).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {};

      const groupList = GroupListFromJSON(json);

      expect(groupList.groups).toBeUndefined();
      expect(groupList.pagination).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = GroupListFromJSON(null);
      expect(result).toBeNull();
    });
  });

  describe('GroupListToJSON', () => {
    it('should convert GroupList object to JSON', () => {
      const groupList: GroupList = {
        groups: [
          {
            id: 'group-123',
            name: 'test-group',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = GroupListToJSON(groupList);

      expect(json.groups).toHaveLength(1);
      expect(json.pagination.page).toBe(1);
    });

    it('should handle undefined fields', () => {
      const groupList: GroupList = {
        groups: undefined,
      };

      const json = GroupListToJSON(groupList);

      expect(json.groups).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = GroupListToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = GroupListToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('instanceOfGroupList', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfGroupList({});
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: GroupList = {
        groups: [
          {
            id: 'group-123',
            name: 'test-group',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = GroupListToJSON(original);
      const restored = GroupListFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
