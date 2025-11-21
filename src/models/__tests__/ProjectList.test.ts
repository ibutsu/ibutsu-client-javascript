import {
  type ProjectList,
  ProjectListFromJSON,
  ProjectListToJSON,
  instanceOfProjectList,
} from '../ProjectList';

describe('ProjectList Model', () => {
  describe('interface and types', () => {
    it('should create a valid ProjectList object with all fields', () => {
      const projectList: ProjectList = {
        projects: [
          {
            id: 'project-123',
            name: 'test-project',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      expect(projectList.projects).toHaveLength(1);
      expect(projectList.pagination?.page).toBe(1);
    });

    it('should create a ProjectList object with minimal fields', () => {
      const projectList: ProjectList = {
        projects: [],
      };

      expect(projectList.projects).toEqual([]);
      expect(projectList.pagination).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const projectList: ProjectList = {
        projects: undefined,
        pagination: undefined,
      };

      expect(projectList.projects).toBeUndefined();
      expect(projectList.pagination).toBeUndefined();
    });
  });

  describe('ProjectListFromJSON', () => {
    it('should convert JSON to ProjectList object', () => {
      const json = {
        projects: [
          {
            id: 'project-123',
            name: 'test-project',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const projectList = ProjectListFromJSON(json);

      expect(projectList.projects).toHaveLength(1);
      expect(projectList.pagination?.page).toBe(1);
      expect(projectList.pagination?.pageSize).toBe(25);
    });

    it('should handle null values correctly', () => {
      const json = {
        projects: null,
        pagination: null,
      };

      const projectList = ProjectListFromJSON(json);

      expect(projectList.projects).toBeUndefined();
      expect(projectList.pagination).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {};

      const projectList = ProjectListFromJSON(json);

      expect(projectList.projects).toBeUndefined();
      expect(projectList.pagination).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = ProjectListFromJSON(null);
      expect(result).toBeNull();
    });
  });

  describe('ProjectListToJSON', () => {
    it('should convert ProjectList object to JSON', () => {
      const projectList: ProjectList = {
        projects: [
          {
            id: 'project-123',
            name: 'test-project',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = ProjectListToJSON(projectList);

      expect(json.projects).toHaveLength(1);
      expect(json.pagination.page).toBe(1);
    });

    it('should handle undefined fields', () => {
      const projectList: ProjectList = {
        projects: undefined,
      };

      const json = ProjectListToJSON(projectList);

      expect(json.projects).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = ProjectListToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = ProjectListToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('instanceOfProjectList', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfProjectList({});
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: ProjectList = {
        projects: [
          {
            id: 'project-123',
            name: 'test-project',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = ProjectListToJSON(original);
      const restored = ProjectListFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
