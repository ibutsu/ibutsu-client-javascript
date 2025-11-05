# Testing Guide for ibutsu-client-javascript

This document provides comprehensive information about the testing infrastructure for the TypeScript client library.

## Overview

The project uses **Jest** with **ts-jest** for unit testing TypeScript models and API client modules. The testing strategy focuses on:

- **Model Tests**: Validating TypeScript interfaces, type conversions (camelCase ↔ snake_case), and JSON serialization
- **API Tests**: Testing HTTP request formation, response parsing, error handling, and authentication
- **Test Utilities**: Reusable mocking helpers for consistent test patterns

## Test Structure

```
src/
├── __tests__/
│   └── test-utils.ts          # Shared test utilities and mock helpers
├── models/
│   ├── __tests__/
│   │   ├── Result.test.ts     # Tests for Result model
│   │   ├── Project.test.ts    # Tests for Project model
│   │   └── Run.test.ts        # Tests for Run model
│   └── *.ts                   # Model files
└── apis/
    ├── __tests__/
    │   ├── ProjectApi.test.ts # Tests for ProjectApi
    │   └── ResultApi.test.ts  # Tests for ResultApi
    └── *.ts                   # API files
```

## Running Tests

### Basic Test Commands

```bash
# Run all tests
yarn test

# Run tests in watch mode (re-runs on file changes)
yarn test:watch

# Run tests with coverage report
yarn test:coverage
```

### Test Configuration

The Jest configuration is in `jest.config.js`:

- **Preset**: `ts-jest` for TypeScript support
- **Test Environment**: Node.js
- **Test Pattern**: `**/__tests__/**/*.test.ts`
- **Coverage**: HTML, LCOV, and text reports in `coverage/` directory

## Current Test Coverage

As of the initial implementation:

- **3 Model Tests**: Result, Project, Run (out of 36 models)
- **2 API Tests**: ProjectApi, ResultApi (out of 16 APIs)
- **83 Total Tests**: All passing ✓
- **Coverage**: ~26% overall
  - Models tested: 100% coverage (Result.ts, Project.ts, Run.ts)
  - APIs tested: ~80% coverage (ProjectApi.ts, ResultApi.ts)

### Coverage Goals

The project currently has baseline coverage thresholds set:
- Statements: 25%
- Branches: 15%
- Functions: 15%
- Lines: 25%

These should be increased as more tests are added. A recommended target is 60-80% coverage for production code.

## Writing Tests

### Model Tests

Model tests focus on:

1. **Interface validation**: Type checking and property access
2. **Enum testing**: Verifying all enum values are correct
3. **JSON conversion**: Testing `FromJSON` and `ToJSON` functions
4. **Round-trip conversion**: Ensuring data integrity through conversion cycles
5. **Null/undefined handling**: Testing optional and nullable fields

Example model test structure:

```typescript
import { MyModel, MyModelFromJSON, MyModelToJSON } from '../MyModel';

describe('MyModel', () => {
  describe('interface and types', () => {
    it('should create a valid model with all fields', () => {
      const model: MyModel = { /* ... */ };
      expect(model.field).toBe('value');
    });
  });

  describe('MyModelFromJSON', () => {
    it('should convert JSON with snake_case to camelCase', () => {
      const json = { my_field: 'value' };
      const model = MyModelFromJSON(json);
      expect(model.myField).toBe('value');
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity', () => {
      const original: MyModel = { /* ... */ };
      const json = MyModelToJSON(original);
      const restored = MyModelFromJSON(json);
      expect(restored).toEqual(original);
    });
  });
});
```

### API Tests

API tests focus on:

1. **Request formation**: URL construction, headers, body serialization
2. **Response parsing**: Correct handling of API responses
3. **HTTP methods**: GET, POST, PUT, DELETE operations
4. **Query parameters**: Pagination, filtering, etc.
5. **Authentication**: Bearer token handling
6. **Error handling**: 4xx, 5xx responses, network errors

Example API test structure:

```typescript
import { MyApi } from '../MyApi';
import { Configuration } from '../../runtime';
import { createMockFetch, setupFetchMock, restoreFetch } from '../../__tests__/test-utils';

describe('MyApi', () => {
  let api: MyApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    setupFetchMock();
    const config = new Configuration({ basePath: 'http://localhost/api' });
    api = new MyApi(config);
  });

  afterEach(() => {
    restoreFetch();
  });

  describe('getData', () => {
    it('should fetch data', async () => {
      const mockData = { id: '123', name: 'test' };
      mockFetch = createMockFetch(mockData);
      global.fetch = mockFetch;

      const result = await api.getData({ id: '123' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/data/123',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result.id).toBe('123');
    });
  });
});
```

### Important Testing Notes

1. **Snake Case in Mocks**: API responses from the server use `snake_case`, so mock data should use snake_case to match real API behavior:
   ```typescript
   const mockResponse = {
     test_id: 'test-123',    // ✓ Correct
     testId: 'test-123'      // ✗ Incorrect
   };
   ```

2. **URL Endpoints**: Verify actual API URLs by checking the generated code or running integration tests

3. **Authentication**: Test both authenticated and unauthenticated scenarios

## Test Utilities

### Available Helpers

Located in `src/__tests__/test-utils.ts`:

- **`createMockConfiguration()`**: Create a mock Configuration object
- **`createMockResponse()`**: Create a mock fetch Response
- **`createMockFetch()`**: Create a single mock fetch function
- **`createMockFetchSequence()`**: Create a fetch mock with multiple responses
- **`setupFetchMock()`**: Initialize global fetch mock
- **`restoreFetch()`**: Clean up fetch mock after tests
- **`validateObjectStructure()`**: Type-safe object validation

### Example Usage

```typescript
import { createMockFetch, setupFetchMock, restoreFetch } from '../../__tests__/test-utils';

// Setup
beforeEach(() => {
  setupFetchMock();
});

afterEach(() => {
  restoreFetch();
});

// In your test
const mockData = { id: '123' };
const mockFetch = createMockFetch(mockData, 200);
global.fetch = mockFetch;
```

## Expanding Test Coverage

To add tests for additional models or APIs:

### 1. For a New Model

```bash
# Create test file
touch src/models/__tests__/NewModel.test.ts
```

Use existing model tests as templates (Result.test.ts, Project.test.ts, Run.test.ts).

### 2. For a New API

```bash
# Create test file
touch src/apis/__tests__/NewApi.test.ts
```

Use existing API tests as templates (ProjectApi.test.ts, ResultApi.test.ts).

### 3. Run Tests to Verify

```bash
yarn test
```

## Integration Testing

For integration tests against a real Ibutsu server, see the separate integration test file:

```bash
# Set environment variables
export IBUTSU_API="https://your-server.com/api"
export IBUTSU_TOKEN="your-token"

# Run integration tests
yarn integration
```

See `integration-test.ts` and `README.md` for more details.

## CI/CD Integration

The project uses pre-commit hooks for linting and formatting. To run all checks:

```bash
# Lint check
yarn lint

# Format check
yarn format:check

# Auto-fix issues
yarn lint:fix
```

## Best Practices

1. **Test Organization**: Group related tests using nested `describe` blocks
2. **Test Naming**: Use descriptive names that explain what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification phases
4. **Mock Data**: Use realistic mock data that matches actual API responses
5. **Coverage**: Aim for high coverage but focus on meaningful tests over hitting metrics
6. **Edge Cases**: Test null values, empty arrays, error conditions, and boundary conditions
7. **Async/Await**: Always use async/await for asynchronous operations
8. **Isolation**: Each test should be independent and not rely on other tests

## Troubleshooting

### Tests Not Running

- Ensure Node.js 22+ is installed: `node --version`
- Install dependencies: `yarn install`
- Check Jest is installed: `yarn list jest`

### Mock Fetch Not Working

- Ensure `setupFetchMock()` is called in `beforeEach`
- Ensure `restoreFetch()` is called in `afterEach`
- Check that `global.fetch = mockFetch` is set before calling the API

### Coverage Too Low

- Run `yarn test:coverage` to see detailed coverage report
- Open `coverage/index.html` in a browser for visual coverage report
- Focus on testing critical paths and common use cases first

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Next Steps

To improve test coverage:

1. Add tests for remaining models (33 more models)
2. Add tests for remaining APIs (14 more APIs)
3. Add tests for the runtime module
4. Increase coverage thresholds gradually
5. Add tests for edge cases and error conditions
6. Consider adding integration tests for complex workflows
