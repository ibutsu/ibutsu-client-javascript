import { type Project, ProjectFromJSON, ProjectToJSON, instanceOfProject } from '../Project';

describe('Project Model', () => {
  describe('interface and types', () => {
    it('should create a valid Project object with all fields', () => {
      const project: Project = {
        id: 'project-123',
        name: 'my-project',
        title: 'My Project',
        ownerId: 'user-456',
        groupId: 'group-789',
      };

      expect(project.id).toBe('project-123');
      expect(project.name).toBe('my-project');
      expect(project.title).toBe('My Project');
      expect(project.ownerId).toBe('user-456');
      expect(project.groupId).toBe('group-789');
    });

    it('should create a Project object with minimal fields', () => {
      const project: Project = {};
      expect(project).toBeDefined();
    });

    it('should allow null values for nullable fields', () => {
      const project: Project = {
        id: 'project-123',
        name: 'my-project',
        ownerId: null,
        groupId: null,
      };

      expect(project.ownerId).toBeNull();
      expect(project.groupId).toBeNull();
    });
  });

  describe('ProjectFromJSON', () => {
    it('should convert JSON with snake_case to Project object with camelCase', () => {
      const json = {
        id: 'project-123',
        name: 'my-project',
        title: 'My Project',
        owner_id: 'user-456',
        group_id: 'group-789',
      };

      const project = ProjectFromJSON(json);

      expect(project.id).toBe('project-123');
      expect(project.name).toBe('my-project');
      expect(project.title).toBe('My Project');
      expect(project.ownerId).toBe('user-456');
      expect(project.groupId).toBe('group-789');
    });

    it('should handle null values correctly', () => {
      const json = {
        id: 'project-123',
        name: 'my-project',
        owner_id: null,
        group_id: null,
      };

      const project = ProjectFromJSON(json);

      expect(project.id).toBe('project-123');
      expect(project.name).toBe('my-project');
      expect(project.ownerId).toBeUndefined();
      expect(project.groupId).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {
        name: 'my-project',
      };

      const project = ProjectFromJSON(json);

      expect(project.name).toBe('my-project');
      expect(project.id).toBeUndefined();
      expect(project.title).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const project = ProjectFromJSON(null);
      expect(project).toBeNull();
    });
  });

  describe('ProjectToJSON', () => {
    it('should convert Project object with camelCase to JSON with snake_case', () => {
      const project: Project = {
        id: 'project-123',
        name: 'my-project',
        title: 'My Project',
        ownerId: 'user-456',
        groupId: 'group-789',
      };

      const json: {
        id?: string;
        name?: string;
        title?: string;
        owner_id?: string;
        group_id?: string;
      } = ProjectToJSON(project) as {
        id?: string;
        name?: string;
        title?: string;
        owner_id?: string;
        group_id?: string;
      };

      expect(json.id).toBe('project-123');
      expect(json.name).toBe('my-project');
      expect(json.title).toBe('My Project');
      expect(json.owner_id).toBe('user-456');
      expect(json.group_id).toBe('group-789');
    });

    it('should handle undefined fields', () => {
      const project: Project = {
        name: 'my-project',
      };

      const json: { name?: string; id?: string } = ProjectToJSON(project) as {
        name?: string;
        id?: string;
      };

      expect(json.name).toBe('my-project');
      expect(json.id).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const json: unknown = ProjectToJSON(null);
      expect(json).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const json: unknown = ProjectToJSON(undefined);
      expect(json).toBeUndefined();
    });
  });

  describe('instanceOfProject', () => {
    it('should return true for any object (as per implementation)', () => {
      expect(instanceOfProject({})).toBe(true);
      expect(instanceOfProject({ name: 'test' })).toBe(true);
      expect(
        instanceOfProject({
          id: 'project-123',
          name: 'my-project',
        })
      ).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: Project = {
        id: 'project-123',
        name: 'test-project',
        title: 'Test Project',
        ownerId: 'user-456',
        groupId: 'group-789',
      };

      const json: unknown = ProjectToJSON(original);
      const restored: Project = ProjectFromJSON(json);

      expect(restored).toEqual(original);
    });

    it('should handle partial data through round-trip', () => {
      const original: Project = {
        name: 'minimal-project',
      };

      const json: unknown = ProjectToJSON(original);
      const restored: Project = ProjectFromJSON(json);

      expect(restored.name).toBe(original.name);
    });
  });
});
