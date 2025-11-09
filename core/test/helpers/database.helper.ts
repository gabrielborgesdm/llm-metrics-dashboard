import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';

/**
 * Clears all data from all tables in the database.
 * Useful for resetting database state between individual tests.
 *
 * Note: This is different from dropSchema which runs once at app startup.
 * - dropSchema: Drops and recreates tables when the test suite starts
 * - clearDatabase: Deletes data between tests while keeping tables intact
 */
export async function clearDatabase(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource);

  // Get all entities
  const entities = dataSource.entityMetadatas;

  // Delete data from all tables (order matters due to foreign keys)
  // Delete in reverse order to handle foreign key constraints
  for (const entity of entities.reverse()) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`DELETE FROM "${entity.tableName}";`);
  }
}

/**
 * Closes all database connections.
 * Should be called in afterAll hook to prevent hanging connections.
 */
export async function closeDatabase(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource);
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }
}
