import * as dotenv from 'dotenv';
import * as path from 'path';

// Load test environment variables before any tests run
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Set test timeout for integration tests (database operations can take longer)
jest.setTimeout(30000);
