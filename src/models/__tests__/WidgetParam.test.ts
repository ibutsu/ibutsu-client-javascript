import {
  type WidgetParam,
  WidgetParamFromJSON,
  WidgetParamToJSON,
  instanceOfWidgetParam,
} from '../WidgetParam';

describe('WidgetParam Model', () => {
  describe('interface and types', () => {
    it('should create a valid WidgetParam object with all fields', () => {
      const widgetParam: WidgetParam = {
        name: 'test-param',
        description: 'A test parameter',
        type: 'string',
      };

      expect(widgetParam.name).toBe('test-param');
      expect(widgetParam.description).toBe('A test parameter');
      expect(widgetParam.type).toBe('string');
    });

    it('should create a WidgetParam object with minimal fields', () => {
      const widgetParam: WidgetParam = {
        name: 'minimal-param',
      };

      expect(widgetParam.name).toBe('minimal-param');
      expect(widgetParam.description).toBeUndefined();
      expect(widgetParam.type).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const widgetParam: WidgetParam = {
        name: undefined,
        description: undefined,
        type: undefined,
      };

      expect(widgetParam.name).toBeUndefined();
      expect(widgetParam.description).toBeUndefined();
      expect(widgetParam.type).toBeUndefined();
    });

    it('should support different parameter types', () => {
      const stringParam: WidgetParam = {
        name: 'str-param',
        type: 'string',
      };
      const intParam: WidgetParam = {
        name: 'int-param',
        type: 'integer',
      };
      const boolParam: WidgetParam = {
        name: 'bool-param',
        type: 'boolean',
      };

      expect(stringParam.type).toBe('string');
      expect(intParam.type).toBe('integer');
      expect(boolParam.type).toBe('boolean');
    });
  });

  describe('WidgetParamFromJSON', () => {
    it('should convert JSON to WidgetParam object', () => {
      const json = {
        name: 'json-param',
        description: 'Parameter from JSON',
        type: 'integer',
      };

      const widgetParam = WidgetParamFromJSON(json);

      expect(widgetParam.name).toBe('json-param');
      expect(widgetParam.description).toBe('Parameter from JSON');
      expect(widgetParam.type).toBe('integer');
    });

    it('should handle null values correctly', () => {
      const json = {
        name: null,
        description: null,
        type: null,
      };

      const widgetParam = WidgetParamFromJSON(json);

      expect(widgetParam.name).toBeUndefined();
      expect(widgetParam.description).toBeUndefined();
      expect(widgetParam.type).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {
        name: 'only-name',
      };

      const widgetParam = WidgetParamFromJSON(json);

      expect(widgetParam.name).toBe('only-name');
      expect(widgetParam.description).toBeUndefined();
      expect(widgetParam.type).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = WidgetParamFromJSON(null);
      expect(result).toBeNull();
    });

    it('should handle empty JSON object', () => {
      const json = {};

      const widgetParam = WidgetParamFromJSON(json);

      expect(widgetParam.name).toBeUndefined();
      expect(widgetParam.description).toBeUndefined();
      expect(widgetParam.type).toBeUndefined();
    });
  });

  describe('WidgetParamToJSON', () => {
    it('should convert WidgetParam object to JSON', () => {
      const widgetParam: WidgetParam = {
        name: 'output-param',
        description: 'Parameter to JSON',
        type: 'string',
      };

      const json = WidgetParamToJSON(widgetParam);

      expect(json.name).toBe('output-param');
      expect(json.description).toBe('Parameter to JSON');
      expect(json.type).toBe('string');
    });

    it('should handle undefined fields', () => {
      const widgetParam: WidgetParam = {
        name: 'partial-param',
      };

      const json = WidgetParamToJSON(widgetParam);

      expect(json.name).toBe('partial-param');
      expect(json.description).toBeUndefined();
      expect(json.type).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = WidgetParamToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = WidgetParamToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should handle empty WidgetParam object', () => {
      const widgetParam: WidgetParam = {};

      const json = WidgetParamToJSON(widgetParam);

      expect(json.name).toBeUndefined();
      expect(json.description).toBeUndefined();
      expect(json.type).toBeUndefined();
    });
  });

  describe('instanceOfWidgetParam', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfWidgetParam({});
      expect(result).toBe(true);
    });

    it('should return true for valid WidgetParam objects', () => {
      const widgetParam: WidgetParam = {
        name: 'test',
        description: 'test description',
        type: 'string',
      };
      const result = instanceOfWidgetParam(widgetParam);
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: WidgetParam = {
        name: 'roundtrip-param',
        description: 'Testing round-trip conversion',
        type: 'boolean',
      };

      const json = WidgetParamToJSON(original);
      const restored = WidgetParamFromJSON(json);

      expect(restored).toEqual(original);
    });

    it('should handle minimal WidgetParam in round-trip', () => {
      const original: WidgetParam = {
        name: 'minimal',
      };

      const json = WidgetParamToJSON(original);
      const restored = WidgetParamFromJSON(json);

      expect(restored).toEqual(original);
    });

    it('should handle empty WidgetParam in round-trip', () => {
      const original: WidgetParam = {};

      const json = WidgetParamToJSON(original);
      const restored = WidgetParamFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
