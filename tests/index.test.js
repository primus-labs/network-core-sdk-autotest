/**
 * Main Application Tests
 */

const { main } = require('../src/index');

describe('Main Application', () => {
  test('should be defined', () => {
    expect(main).toBeDefined();
    expect(typeof main).toBe('function');
  });

  test('should run without errors', async () => {
    // Mock console.log to avoid output during tests
    const originalLog = console.log;
    console.log = jest.fn();
    
    try {
      await main();
      expect(console.log).toHaveBeenCalledWith('✅ Application initialized successfully');
    } finally {
      console.log = originalLog;
    }
  });
});
