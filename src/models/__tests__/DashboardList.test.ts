import {
  type DashboardList,
  DashboardListFromJSON,
  DashboardListToJSON,
  instanceOfDashboardList,
} from '../DashboardList';

describe('DashboardList Model', () => {
  describe('interface and types', () => {
    it('should create a valid DashboardList object with all fields', () => {
      const dashboardList: DashboardList = {
        dashboards: [
          {
            id: 'dashboard-123',
            title: 'Test Dashboard',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      expect(dashboardList.dashboards).toHaveLength(1);
      expect(dashboardList.pagination?.page).toBe(1);
    });

    it('should create a DashboardList object with minimal fields', () => {
      const dashboardList: DashboardList = {
        dashboards: [],
      };

      expect(dashboardList.dashboards).toEqual([]);
      expect(dashboardList.pagination).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const dashboardList: DashboardList = {
        dashboards: undefined,
        pagination: undefined,
      };

      expect(dashboardList.dashboards).toBeUndefined();
      expect(dashboardList.pagination).toBeUndefined();
    });
  });

  describe('DashboardListFromJSON', () => {
    it('should convert JSON to DashboardList object', () => {
      const json = {
        dashboards: [
          {
            id: 'dashboard-123',
            title: 'Test Dashboard',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const dashboardList = DashboardListFromJSON(json);

      expect(dashboardList.dashboards).toHaveLength(1);
      expect(dashboardList.pagination?.page).toBe(1);
      expect(dashboardList.pagination?.pageSize).toBe(25);
    });

    it('should handle null values correctly', () => {
      const json = {
        dashboards: null,
        pagination: null,
      };

      const dashboardList = DashboardListFromJSON(json);

      expect(dashboardList.dashboards).toBeUndefined();
      expect(dashboardList.pagination).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {};

      const dashboardList = DashboardListFromJSON(json);

      expect(dashboardList.dashboards).toBeUndefined();
      expect(dashboardList.pagination).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = DashboardListFromJSON(null);
      expect(result).toBeNull();
    });
  });

  describe('DashboardListToJSON', () => {
    it('should convert DashboardList object to JSON', () => {
      const dashboardList: DashboardList = {
        dashboards: [
          {
            id: 'dashboard-123',
            title: 'Test Dashboard',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = DashboardListToJSON(dashboardList);

      expect(json.dashboards).toHaveLength(1);
      expect(json.pagination.page).toBe(1);
    });

    it('should handle undefined fields', () => {
      const dashboardList: DashboardList = {
        dashboards: undefined,
      };

      const json = DashboardListToJSON(dashboardList);

      expect(json.dashboards).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = DashboardListToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = DashboardListToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('instanceOfDashboardList', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfDashboardList({});
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: DashboardList = {
        dashboards: [
          {
            id: 'dashboard-123',
            title: 'Test Dashboard',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1,
          totalPages: 1,
        },
      };

      const json = DashboardListToJSON(original);
      const restored = DashboardListFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
