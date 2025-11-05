#!/usr/bin/env node
/**
 * Integration Test Script for ibutsu-client-javascript
 *
 * This script tests the built TypeScript client against a real, running Ibutsu server.
 *
 * Environment Variables:
 * - IBUTSU_API: The base URL for the Ibutsu API endpoint (e.g., https://ibutsu.example.com/api)
 * - IBUTSU_TOKEN: A valid authentication token for the Ibutsu server
 * - NODE_TLS_REJECT_UNAUTHORIZED: Set to '0' to disable SSL certificate validation (for corporate/testing environments)
 */

import { Configuration, HealthApi, ResultApi, RunApi, ProjectApi } from './dist/cjs/index.js';

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset): void {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message: string): void {
  log(`✓ ${message}`, colors.green);
}

function logError(message: string): void {
  log(`✗ ${message}`, colors.red);
}

function logInfo(message: string): void {
  log(`ℹ ${message}`, colors.blue);
}

function logWarning(message: string): void {
  log(`⚠ ${message}`, colors.yellow);
}

function logSection(title: string): void {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`  ${title}`, colors.cyan);
  log(`${'='.repeat(60)}`, colors.cyan);
}

// Validate environment variables
function validateEnvironment(): { apiUrl: string; token: string } {
  logSection('Environment Validation');

  const apiUrl = process.env.IBUTSU_API;
  const token = process.env.IBUTSU_TOKEN;

  if (!apiUrl) {
    logError('IBUTSU_API environment variable is not set');
    log(
      'Please set IBUTSU_API to your Ibutsu server API endpoint (e.g., https://ibutsu.example.com/api)'
    );
    process.exit(1);
  }

  if (!token) {
    logError('IBUTSU_TOKEN environment variable is not set');
    log('Please set IBUTSU_TOKEN to a valid authentication token');
    process.exit(1);
  }

  logSuccess(`IBUTSU_API: ${apiUrl}`);
  logSuccess('IBUTSU_TOKEN: [REDACTED]');

  return { apiUrl, token };
}

// Test health endpoints
async function testHealthEndpoints(healthApi: HealthApi): Promise<boolean> {
  logSection('Health Endpoint Tests');
  let allPassed = true;

  try {
    logInfo('Testing GET /health...');
    const health = await healthApi.getHealth();
    const healthStatus = health.status?.toLowerCase();
    if (healthStatus === 'ok') {
      logSuccess('General health check passed');
      log(`  Status: ${health.status}`);
    } else {
      logWarning('General health check returned non-ok status');
      log(`  Status: ${health.status}`);
      allPassed = false;
    }
  } catch (error) {
    logError(`General health check failed: ${error}`);
    if (error instanceof Error) {
      log(`  Error name: ${error.name}`);
      log(`  Error message: ${error.message}`);
      if ('cause' in error && error.cause instanceof Error) {
        log(`  Cause: ${error.cause.message}`);
      }
    }
    allPassed = false;
  }

  try {
    logInfo('Testing GET /health/info...');
    const healthInfo = await healthApi.getHealthInfo();
    logSuccess('Health info retrieved');
    log(`  Frontend: ${healthInfo.frontend || 'unknown'}`);
    log(`  Backend: ${healthInfo.backend || 'unknown'}`);
    log(`  API UI: ${healthInfo.apiUi || 'unknown'}`);
  } catch (error) {
    logError(`Health info request failed: ${error}`);
    allPassed = false;
  }

  return allPassed;
}

// Test result endpoints
async function testResultEndpoints(
  resultApi: ResultApi,
  projectId: string
): Promise<boolean> {
  logSection('Result Endpoint Tests');
  let allPassed = true;

  try {
    logInfo('Testing GET /result (list results)...');
    const filters = [`project_id=${projectId}`];
    const resultList = await resultApi.getResultList({
      filter: filters,
      page: 1,
      pageSize: 5,
    });
    logSuccess('Result list retrieved');
    log(`  Total results: ${resultList.pagination?.totalItems || 'unknown'}`);
    log(`  Results returned: ${resultList.results?.length || 0}`);
    log(`  Filtered by project: ${projectId}`);

    if (resultList.results && resultList.results.length > 0) {
      const firstResult = resultList.results[0];
      log(`  First result ID: ${firstResult.id || 'N/A'}`);
      log(`  First result testId: ${firstResult.testId || 'N/A'}`);
      log(`  First result status: ${firstResult.result || 'N/A'}`);
    }
  } catch (error) {
    logError(`Failed to retrieve result list: ${error}`);
    if (error instanceof Error && 'response' in error) {
      const response = (error as any).response;
      log(`  HTTP Status: ${response?.status} ${response?.statusText || ''}`);
    }
    allPassed = false;
  }

  try {
    logInfo('Testing GET /result with filters...');
    const filters = [`project_id=${projectId}`, 'result=passed'];
    const filteredResults = await resultApi.getResultList({
      filter: filters,
      page: 1,
      pageSize: 3,
    });
    logSuccess('Filtered result list retrieved');
    log(`  Results with "passed" status: ${filteredResults.results?.length || 0}`);
  } catch (error) {
    logError(`Failed to retrieve filtered results: ${error}`);
    if (error instanceof Error && 'response' in error) {
      const response = (error as any).response;
      log(`  HTTP Status: ${response?.status} ${response?.statusText || ''}`);
    }
    allPassed = false;
  }

  return allPassed;
}

// Test run endpoints
async function testRunEndpoints(runApi: RunApi, projectId: string): Promise<boolean> {
  logSection('Run Endpoint Tests');
  let allPassed = true;

  try {
    logInfo('Testing GET /run (list runs)...');
    const filters = [`project_id=${projectId}`];
    const runList = await runApi.getRunList({
      filter: filters,
      page: 1,
      pageSize: 5,
    });
    logSuccess('Run list retrieved');
    log(`  Total runs: ${runList.pagination?.totalItems || 'unknown'}`);
    log(`  Runs returned: ${runList.runs?.length || 0}`);
    log(`  Filtered by project: ${projectId}`);

    if (runList.runs && runList.runs.length > 0) {
      const firstRun = runList.runs[0];
      log(`  First run ID: ${firstRun.id || 'N/A'}`);
      log(`  First run metadata: ${JSON.stringify(firstRun.metadata || {})}`);
    }
  } catch (error) {
    logError(`Failed to retrieve run list: ${error}`);
    if (error instanceof Error && 'response' in error) {
      const response = (error as any).response;
      log(`  HTTP Status: ${response?.status} ${response?.statusText || ''}`);
    }
    allPassed = false;
  }

  return allPassed;
}

// Test project endpoints
async function testProjectEndpoints(projectApi: ProjectApi): Promise<boolean> {
  logSection('Project Endpoint Tests');
  let allPassed = true;

  try {
    logInfo('Testing GET /project (list projects)...');
    const projectList = await projectApi.getProjectList({
      page: 1,
      pageSize: 10,
    });
    logSuccess('Project list retrieved');
    log(`  Total projects: ${projectList.pagination?.totalItems || 'unknown'}`);
    log(`  Projects returned: ${projectList.projects?.length || 0}`);

    if (projectList.projects && projectList.projects.length > 0) {
      const firstProject = projectList.projects[0];
      log(`  First project ID: ${firstProject.id || 'N/A'}`);
      log(`  First project name: ${firstProject.name || 'N/A'}`);
    }
  } catch (error) {
    logError(`Failed to retrieve project list: ${error}`);
    if (error instanceof Error && 'response' in error) {
      const response = (error as any).response;
      log(`  HTTP Status: ${response?.status} ${response?.statusText || ''}`);
    }
    allPassed = false;
  }

  return allPassed;
}

// Main test runner
async function runIntegrationTests(): Promise<void> {
  log('\n');
  logSection('Ibutsu Client Integration Test');
  log('Testing against a live Ibutsu server\n');

  // Validate environment
  const { apiUrl, token } = validateEnvironment();

  // Configure the client
  logSection('Client Configuration');
  const config = new Configuration({
    basePath: apiUrl,
    accessToken: token,
  });
  logSuccess('Client configured successfully');

  // Initialize API instances
  const healthApi = new HealthApi(config);
  const resultApi = new ResultApi(config);
  const runApi = new RunApi(config);
  const projectApi = new ProjectApi(config);

  // Track test results
  const testResults: { [key: string]: boolean } = {};

  // Run health tests first
  testResults['Health Endpoints'] = await testHealthEndpoints(healthApi);

  // Get a project to use for filtering
  // REQUIRED: Run and Result queries must include project_id to prevent backend timeouts
  logSection('Project Selection');
  logInfo('Querying projects - a project is required for run/result queries...');

  let selectedProjectId: string;
  try {
    const projectList = await projectApi.getProjectList({
      page: 1,
      pageSize: 10,
    });

    if (projectList.projects && projectList.projects.length > 0) {
      const firstProject = projectList.projects[0];
      selectedProjectId = firstProject.id!;
      logSuccess('Selected project for filtered queries');
      log(`  Project ID: ${selectedProjectId}`);
      log(`  Project Name: ${firstProject.name || 'N/A'}`);
    } else {
      logError('No projects found in the system');
      logError('Cannot continue - run and result queries require a project_id filter');
      log('\nExiting without running run/result endpoint tests...');
      process.exit(1);
    }
  } catch (error) {
    logError('Failed to query projects');
    if (error instanceof Error && 'response' in error) {
      const response = (error as any).response;
      log(`  HTTP Status: ${response?.status} ${response?.statusText || ''}`);
    }
    logError('Cannot continue - a project is required for run/result queries');
    log('\nExiting without running run/result endpoint tests...');
    process.exit(1);
  }

  // Run project tests
  testResults['Project Endpoints'] = await testProjectEndpoints(projectApi);

  // Run tests with project filter
  testResults['Result Endpoints'] = await testResultEndpoints(resultApi, selectedProjectId);
  testResults['Run Endpoints'] = await testRunEndpoints(runApi, selectedProjectId);

  // Summary
  logSection('Test Summary');
  let allTestsPassed = true;

  for (const [testName, passed] of Object.entries(testResults)) {
    if (passed) {
      logSuccess(`${testName}: PASSED`);
    } else {
      logError(`${testName}: FAILED`);
      allTestsPassed = false;
    }
  }

  log('\n');
  if (allTestsPassed) {
    logSuccess('All integration tests passed!');
    process.exit(0);
  } else {
    logError('Some integration tests failed!');
    process.exit(1);
  }
}

// Run the tests
runIntegrationTests().catch((error) => {
  logError(`Unexpected error during test execution: ${error}`);
  console.error(error);
  process.exit(1);
});
