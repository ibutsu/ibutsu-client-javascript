import {
  Result,
  ResultResultEnum,
  ResultFromJSON,
  ResultToJSON,
  instanceOfResult,
} from '../Result';

describe('Result Model', () => {
  describe('interface and types', () => {
    it('should create a valid Result object with all fields', () => {
      const result: Result = {
        id: 'result-123',
        testId: 'test-456',
        startTime: '2024-01-01T00:00:00Z',
        duration: 10.5,
        result: ResultResultEnum.Passed,
        component: 'frontend',
        env: 'production',
        runId: 'run-789',
        projectId: 'project-101',
        metadata: { browser: 'chrome' },
        params: { timeout: 30 },
        source: 'pytest',
      };

      expect(result.id).toBe('result-123');
      expect(result.testId).toBe('test-456');
      expect(result.duration).toBe(10.5);
      expect(result.result).toBe('passed');
    });

    it('should create a Result object with minimal fields', () => {
      const result: Result = {};
      expect(result).toBeDefined();
    });

    it('should allow null values for nullable fields', () => {
      const result: Result = {
        component: null,
        env: null,
        runId: null,
        projectId: null,
      };

      expect(result.component).toBeNull();
      expect(result.env).toBeNull();
      expect(result.runId).toBeNull();
      expect(result.projectId).toBeNull();
    });
  });

  describe('ResultResultEnum', () => {
    it('should have all expected result statuses', () => {
      expect(ResultResultEnum.Passed).toBe('passed');
      expect(ResultResultEnum.Failed).toBe('failed');
      expect(ResultResultEnum.Error).toBe('error');
      expect(ResultResultEnum.Skipped).toBe('skipped');
      expect(ResultResultEnum.Xpassed).toBe('xpassed');
      expect(ResultResultEnum.Xfailed).toBe('xfailed');
      expect(ResultResultEnum.Manual).toBe('manual');
      expect(ResultResultEnum.Blocked).toBe('blocked');
    });

    it('should use enum values in Result objects', () => {
      const passed: Result = { result: ResultResultEnum.Passed };
      const failed: Result = { result: ResultResultEnum.Failed };
      const error: Result = { result: ResultResultEnum.Error };

      expect(passed.result).toBe('passed');
      expect(failed.result).toBe('failed');
      expect(error.result).toBe('error');
    });
  });

  describe('ResultFromJSON', () => {
    it('should convert JSON with snake_case to Result object with camelCase', () => {
      const json = {
        id: 'result-123',
        test_id: 'test-456',
        start_time: '2024-01-01T00:00:00Z',
        duration: 10.5,
        result: 'passed',
        component: 'frontend',
        env: 'production',
        run_id: 'run-789',
        project_id: 'project-101',
        metadata: { browser: 'chrome' },
        params: { timeout: 30 },
        source: 'pytest',
      };

      const result = ResultFromJSON(json);

      expect(result.id).toBe('result-123');
      expect(result.testId).toBe('test-456');
      expect(result.startTime).toBe('2024-01-01T00:00:00Z');
      expect(result.duration).toBe(10.5);
      expect(result.result).toBe('passed');
      expect(result.runId).toBe('run-789');
      expect(result.projectId).toBe('project-101');
    });

    it('should handle null values correctly', () => {
      const json = {
        id: 'result-123',
        component: null,
        env: null,
      };

      const result = ResultFromJSON(json);

      expect(result.id).toBe('result-123');
      expect(result.component).toBeUndefined();
      expect(result.env).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {
        id: 'result-123',
      };

      const result = ResultFromJSON(json);

      expect(result.id).toBe('result-123');
      expect(result.testId).toBeUndefined();
      expect(result.duration).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = ResultFromJSON(null);
      expect(result).toBeNull();
    });
  });

  describe('ResultToJSON', () => {
    it('should convert Result object with camelCase to JSON with snake_case', () => {
      const result: Result = {
        id: 'result-123',
        testId: 'test-456',
        startTime: '2024-01-01T00:00:00Z',
        duration: 10.5,
        result: ResultResultEnum.Passed,
        runId: 'run-789',
        projectId: 'project-101',
        metadata: { browser: 'chrome' },
      };

      const json = ResultToJSON(result);

      expect(json.id).toBe('result-123');
      expect(json.test_id).toBe('test-456');
      expect(json.start_time).toBe('2024-01-01T00:00:00Z');
      expect(json.duration).toBe(10.5);
      expect(json.result).toBe('passed');
      expect(json.run_id).toBe('run-789');
      expect(json.project_id).toBe('project-101');
    });

    it('should handle undefined fields', () => {
      const result: Result = {
        id: 'result-123',
      };

      const json = ResultToJSON(result);

      expect(json.id).toBe('result-123');
      expect(json.test_id).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const json = ResultToJSON(null);
      expect(json).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const json = ResultToJSON(undefined);
      expect(json).toBeUndefined();
    });
  });

  describe('instanceOfResult', () => {
    it('should return true for any object (as per implementation)', () => {
      expect(instanceOfResult({})).toBe(true);
      expect(instanceOfResult({ id: 'test' })).toBe(true);
      expect(
        instanceOfResult({
          id: 'result-123',
          testId: 'test-456',
        })
      ).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: Result = {
        id: 'result-123',
        testId: 'test-456',
        startTime: '2024-01-01T00:00:00Z',
        duration: 10.5,
        result: ResultResultEnum.Failed,
        component: 'backend',
        env: 'staging',
        runId: 'run-789',
        projectId: 'project-101',
        metadata: { retry: true },
        params: { timeout: 60 },
        source: 'pytest',
      };

      const json = ResultToJSON(original);
      const restored = ResultFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});

