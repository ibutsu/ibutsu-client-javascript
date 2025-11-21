import {
  type Pagination,
  PaginationFromJSON,
  PaginationToJSON,
  instanceOfPagination,
} from '../Pagination';

describe('Pagination Model', () => {
  describe('interface and types', () => {
    it('should create a valid Pagination object with all fields', () => {
      const pagination: Pagination = {
        page: 2,
        pageSize: 50,
        totalItems: 150,
        totalPages: 3,
      };

      expect(pagination.page).toBe(2);
      expect(pagination.pageSize).toBe(50);
      expect(pagination.totalItems).toBe(150);
      expect(pagination.totalPages).toBe(3);
    });

    it('should create a Pagination object with minimal fields', () => {
      const pagination: Pagination = {
        page: 1,
        pageSize: 25,
      };

      expect(pagination.page).toBe(1);
      expect(pagination.pageSize).toBe(25);
      expect(pagination.totalItems).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const pagination: Pagination = {
        page: undefined,
        pageSize: undefined,
        totalItems: undefined,
        totalPages: undefined,
      };

      expect(pagination.page).toBeUndefined();
      expect(pagination.totalItems).toBeUndefined();
    });
  });

  describe('PaginationFromJSON', () => {
    it('should convert JSON to Pagination object', () => {
      const json = {
        page: 3,
        pageSize: 100,
        totalItems: 500,
        totalPages: 5,
      };

      const pagination = PaginationFromJSON(json);

      expect(pagination.page).toBe(3);
      expect(pagination.pageSize).toBe(100);
      expect(pagination.totalItems).toBe(500);
      expect(pagination.totalPages).toBe(5);
    });

    it('should handle null values correctly', () => {
      const json = {
        page: null,
        page_size: null,
        total_items: null,
        total_pages: null,
      };

      const pagination = PaginationFromJSON(json);

      expect(pagination.page).toBeUndefined();
      expect(pagination.pageSize).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {
        page: 1,
      };

      const pagination = PaginationFromJSON(json);

      expect(pagination.page).toBe(1);
      expect(pagination.pageSize).toBeUndefined();
      expect(pagination.totalItems).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = PaginationFromJSON(null);
      expect(result).toBeNull();
    });
  });

  describe('PaginationToJSON', () => {
    it('should convert Pagination object to JSON', () => {
      const pagination: Pagination = {
        page: 4,
        pageSize: 25,
        totalItems: 200,
        totalPages: 8,
      };

      const json = PaginationToJSON(pagination);

      expect(json.page).toBe(4);
      expect(json.pageSize).toBe(25);
      expect(json.totalItems).toBe(200);
      expect(json.totalPages).toBe(8);
    });

    it('should handle undefined fields', () => {
      const pagination: Pagination = {
        page: 1,
        pageSize: 10,
      };

      const json = PaginationToJSON(pagination);

      expect(json.page).toBe(1);
      expect(json.pageSize).toBe(10);
      expect(json.totalItems).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = PaginationToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = PaginationToJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('instanceOfPagination', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfPagination({});
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: Pagination = {
        page: 5,
        pageSize: 75,
        totalItems: 300,
        totalPages: 4,
      };

      const json = PaginationToJSON(original);
      const restored = PaginationFromJSON(json);

      expect(restored).toEqual(original);
    });

    it('should handle pagination with zero items', () => {
      const original: Pagination = {
        page: 1,
        pageSize: 25,
        totalItems: 0,
        totalPages: 0,
      };

      const json = PaginationToJSON(original);
      const restored = PaginationFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
