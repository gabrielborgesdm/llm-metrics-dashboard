import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.config';

/**
 * Creates and configures a NestJS application for e2e testing.
 * This ensures all tests use the same app configuration as production.
 *
 * Usage in your test files:
 *
 * beforeAll(async () => {
 *   app = await createTestApp();
 * });
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // Apply the same configuration as production
  configureApp(app);

  await app.init();

  return app;
}
