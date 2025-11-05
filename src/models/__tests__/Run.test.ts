import { Run, RunFromJSON, RunToJSON, instanceOfRun } from '../Run';

describe('Run Model', () => {
  describe('interface and types', () => {
    it('should create a valid Run object with all fields', () => {
      const run: Run = {
        id: 'run-123',
        created: '2024-01-01T00:00:00Z',
        duration: 120.5,
        source: 'pytest',
        startTime: '2024-01-01T00:00:00Z',
        component: 'backend',
        env: 'production',
        projectId: 'project-456',
        summary: {
          passed: 10,
          failed: 2,
          skipped: 1,
        },
        metadata: {
          build: '1234',
          branch: 'main',
        },
      };

      expect(run.id).toBe('run-123');
      expect(run.duration).toBe(120.5);
      expect(run.projectId).toBe('project-456');
      expect(run.summary).toEqual({
        passed: 10,
        failed: 2,
        skipped: 1,
      });
    });

    it('should create a Run object with minimal fields', () => {
      const run: Run = {};
      expect(run).toBeDefined();
    });

    it('should allow null values for nullable fields', () => {
      const run: Run = {
        id: 'run-123',
        source: null,
        component: null,
        env: null,
        projectId: null,
        metadata: null,
      };

      expect(run.source).toBeNull();
      expect(run.component).toBeNull();
      expect(run.env).toBeNull();
      expect(run.projectId).toBeNull();
      expect(run.metadata).toBeNull();
    });
  });

  describe('RunFromJSON', () => {
    it('should convert JSON with snake_case to Run object with camelCase', () => {
      const json = {
        id: 'run-123',
        created: '2024-01-01T00:00:00Z',
        duration: 120.5,
        source: 'pytest',
        start_time: '2024-01-01T00:00:00Z',
        component: 'backend',
        env: 'production',
        project_id: 'project-456',
        summary: {
          passed: 10,
          failed: 2,
        },
        metadata: {
          build: '1234',
        },
      };

      const run = RunFromJSON(json);

      expect(run.id).toBe('run-123');
      expect(run.created).toBe('2024-01-01T00:00:00Z');
      expect(run.startTime).toBe('2024-01-01T00:00:00Z');
      expect(run.projectId).toBe('project-456');
      expect(run.summary).toEqual({ passed: 10, failed: 2 });
    });

    it('should handle null values correctly', () => {
      const json = {
        id: 'run-123',
        source: null,
        component: null,
        metadata: null,
      };

      const run = RunFromJSON(json);

      expect(run.id).toBe('run-123');
      expect(run.source).toBeUndefined();
      expect(run.component).toBeUndefined();
      expect(run.metadata).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {
        id: 'run-123',
      };

      const run = RunFromJSON(json);

      expect(run.id).toBe('run-123');
      expect(run.duration).toBeUndefined();
      expect(run.summary).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const run = RunFromJSON(null);
      expect(run).toBeNull();
    });
  });

  describe('RunToJSON', () => {
    it('should convert Run object with camelCase to JSON with snake_case', () => {
      const run: Run = {
        id: 'run-123',
        created: '2024-01-01T00:00:00Z',
        duration: 120.5,
        source: 'pytest',
        startTime: '2024-01-01T00:00:00Z',
        component: 'backend',
        env: 'production',
        projectId: 'project-456',
        summary: { passed: 10, failed: 2 },
        metadata: { build: '1234' },
      };

      const json = RunToJSON(run);

      expect(json.id).toBe('run-123');
      expect(json.created).toBe('2024-01-01T00:00:00Z');
      expect(json.start_time).toBe('2024-01-01T00:00:00Z');
      expect(json.project_id).toBe('project-456');
      expect(json.summary).toEqual({ passed: 10, failed: 2 });
    });

    it('should handle undefined fields', () => {
      const run: Run = {
        id: 'run-123',
      };

      const json = RunToJSON(run);

      expect(json.id).toBe('run-123');
      expect(json.duration).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const json = RunToJSON(null);
      expect(json).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const json = RunToJSON(undefined);
      expect(json).toBeUndefined();
    });
  });

  describe('instanceOfRun', () => {
    it('should return true for any object (as per implementation)', () => {
      expect(instanceOfRun({})).toBe(true);
      expect(instanceOfRun({ id: 'test' })).toBe(true);
      expect(
        instanceOfRun({
          id: 'run-123',
          duration: 120,
        })
      ).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: Run = {
        id: 'run-123',
        created: '2024-01-01T00:00:00Z',
        duration: 120.5,
        source: 'pytest',
        startTime: '2024-01-01T00:00:00Z',
        component: 'backend',
        env: 'staging',
        projectId: 'project-456',
        summary: {
          passed: 15,
          failed: 3,
          skipped: 2,
        },
        metadata: {
          build: '5678',
          branch: 'develop',
        },
      };

      const json = RunToJSON(original);
      const restored = RunFromJSON(json);

      expect(restored).toEqual(original);
    });

    it('should handle complex summary objects through round-trip', () => {
      const original: Run = {
        id: 'run-123',
        summary: {
          total: 100,
          passed: 85,
          failed: 10,
          skipped: 5,
          error: 0,
        },
      };

      const json = RunToJSON(original);
      const restored = RunFromJSON(json);

      expect(restored.summary).toEqual(original.summary);
    });
  });
});

