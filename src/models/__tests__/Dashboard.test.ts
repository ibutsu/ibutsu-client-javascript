import {
  type Dashboard,
  DashboardFromJSON,
  DashboardToJSON,
  instanceOfDashboard,
} from '../Dashboard';

describe('Dashboard Model', () => {
  describe('interface and types', () => {
    it('should create a valid Dashboard object with all fields', () => {
      const dashboard: Dashboard = {
        id: 'dashboard-123',
        title: 'Test Dashboard',
        description: 'A test dashboard for testing',
        filters: 'status=active',
        projectId: 'project-456',
        userId: 'user-789',
      };

      expect(dashboard.id).toBe('dashboard-123');
      expect(dashboard.title).toBe('Test Dashboard');
      expect(dashboard.description).toBe('A test dashboard for testing');
    });

    it('should create a Dashboard object with minimal fields', () => {
      const dashboard: Dashboard = {
        title: 'Simple Dashboard',
      };

      expect(dashboard.title).toBe('Simple Dashboard');
      expect(dashboard.id).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const dashboard: Dashboard = {
        id: undefined,
        title: 'Test',
        description: undefined,
      };

      expect(dashboard.id).toBeUndefined();
      expect(dashboard.description).toBeUndefined();
    });
  });

  describe('DashboardFromJSON', () => {
    it('should convert JSON to Dashboard object', () => {
      const json = {
        id: 'dashboard-456',
        title: 'My Dashboard',
        description: 'Description',
        filters: 'env=prod',
      };

      const dashboard = DashboardFromJSON(json);

      expect(dashboard.id).toBe('dashboard-456');
      expect(dashboard.title).toBe('My Dashboard');
      expect(dashboard.description).toBe('Description');
    });

    it('should handle null values correctly', () => {
      const json = {
        title: 'Test',
        description: null,
      };

      const dashboard = DashboardFromJSON(json);

      expect(dashboard.description).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {
        title: 'Test Dashboard',
      };

      const dashboard = DashboardFromJSON(json);

      expect(dashboard.title).toBe('Test Dashboard');
      expect(dashboard.id).toBeUndefined();
      expect(dashboard.description).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = DashboardFromJSON(null);
      expect(result).toBeNull();
    });
  });

  describe('DashboardToJSON', () => {
    it('should convert Dashboard object to JSON', () => {
      const dashboard: Dashboard = {
        id: 'dashboard-789',
        title: 'Export Dashboard',
        description: 'For export',
        filters: 'type=test',
      };

      const json = DashboardToJSON(dashboard);

      expect(json.id).toBe('dashboard-789');
      expect(json.title).toBe('Export Dashboard');
      expect(json.description).toBe('For export');
    });

    it('should handle undefined fields', () => {
      const dashboard: Dashboard = {
        title: 'Test',
      };

      const json = DashboardToJSON(dashboard);

      expect(json.title).toBe('Test');
      expect(json.id).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = DashboardToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = DashboardToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('instanceOfDashboard', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfDashboard({});
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: Dashboard = {
        id: 'dashboard-999',
        title: 'Round Trip Dashboard',
        description: 'Test round trip',
        filters: 'env=staging',
        projectId: 'project-123',
      };

      const json = DashboardToJSON(original);
      const restored = DashboardFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
