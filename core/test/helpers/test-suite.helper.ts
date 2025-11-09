import { INestApplication } from '@nestjs/common';
import { createTestApp } from './test-app.helper';
import { clearDatabase, closeDatabase } from './database.helper';

/**
 * Sets up a complete e2e test suite with app lifecycle management.
 * This helper reduces boilerplate by managing app creation, cleanup, and teardown.
 *
 * Usage:
 *
 * describe('MyController (e2e)', () => {
 *   const testSuite = setupTestSuite();
 *
 *   it('should do something', async () => {
 *     const app = testSuite.getApp();
 *     // ... your test logic
 *   });
 * });
 */
export function setupTestSuite() {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await clearDatabase(app);
  });

  afterAll(async () => {
    await closeDatabase(app);
    await app.close();
  });

  return {
    getApp: () => app,
  };
}
