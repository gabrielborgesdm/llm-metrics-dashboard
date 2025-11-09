import { setupTestSuite } from './helpers/test-suite.helper';

describe('AppController (e2e)', () => {
  const testSuite = setupTestSuite();

  it('should initialize the app successfully', () => {
    expect(testSuite.getApp()).toBeDefined();
  });
});
