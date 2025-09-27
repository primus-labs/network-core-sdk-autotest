/**
 * Jest Test Setup
 */

// Global test setup
beforeAll(() => {
  console.log('🧪 Setting up test environment...');
});

afterAll(() => {
  console.log('🧹 Cleaning up test environment...');
});

// Global test utilities
global.testUtils = {
  // Add common test utilities here
  createMockData: () => {
    return {
      id: 'test-id',
      name: 'Test Data',
      timestamp: new Date().toISOString()
    };
  }
};
