# LLM Metrics Dashboard

A library management system built with NestJS and TypeORM.

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+

## Database Setup

### 1. Configure Environment Variables

Navigate to the `core` directory and create a `.env` file:

```bash
cd core
cp .env.example .env
```

Update the `.env` file with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=library_db
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Database Migrations

Run all migrations to create the database schema and seed initial data:

```bash
npm run typeorm migration:run
```

This will:
- Create all database tables (users, books, authors, loans)
- Set up the many-to-many relationship between books and authors
- Seed the database with initial data

### 4. Default User Credentials

After running migrations, you can login with these default users:

| Role   | Email                 | Password    |
|--------|-----------------------|-------------|
| Admin  | admin@library.com     | Admin123!   |
| Member | member@library.com    | Member123!  |

### Seeded Data Overview

The database will be populated with:
- **2 Users**: 1 admin and 1 member (with hashed passwords)
- **4 Authors**: J.K. Rowling, George Orwell, Jane Austen, F. Scott Fitzgerald
- **5 Books**:
  - Harry Potter and the Philosopher's Stone
  - 1984
  - Pride and Prejudice
  - The Great Gatsby
  - Animal Farm
- **3 Loans**: Mix of active and returned loans

## Development

### Running the Application

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000` with Swagger documentation at `http://localhost:3000/api`.

### TypeORM CLI Commands

Generate a new migration:
```bash
npm run typeorm migration:generate src/migrations/MigrationName
```

Create a blank migration:
```bash
npx typeorm-ts-node-commonjs migration:create src/migrations/MigrationName
```

Revert the last migration:
```bash
npm run typeorm migration:revert
```

## Testing

### Integration Tests

The project includes comprehensive integration tests that use a separate PostgreSQL test database.

#### Prerequisites

1. **Docker Desktop** must be running
2. Test database configuration is in `docker-compose.test.yml`

#### Running Tests

**Start the test database:**
```bash
npm run test:db:start
```

**Run integration tests:**
```bash
npm run test:e2e
```

**Stop the test database:**
```bash
npm run test:db:stop
```

**Run everything in one command:**
```bash
npm run test:e2e:full
```

This will automatically start the test database, run all tests, and stop the database.

#### Test Database Configuration

The test database uses these settings (configured in `.env.test`):
- **Host**: 127.0.0.1
- **Port**: 5434 (separate from production DB on 5433)
- **Database**: test_db
- **User**: test
- **Password**: test

#### What's Tested

Integration tests cover:
- ✅ Authentication (signup, signin)
- ✅ JWT token generation and validation
- ✅ Request validation (email format, password length, etc.)
- ✅ Database operations (user creation, duplicate email handling)
- ✅ Error responses (401, 400, 409)

#### Writing Tests

Use the test helpers to simplify test creation:

```typescript
import { setupTestSuite } from './helpers/test-suite.helper';
import { createAuthenticatedUser } from './helpers/auth.helper';

describe('MyController (e2e)', () => {
  const testSuite = setupTestSuite();

  it('should do something', async () => {
    // Create an authenticated user
    const { user, token } = await createAuthenticatedUser(testSuite.getApp());

    // Make authenticated requests
    const response = await request(testSuite.getApp().getHttpServer())
      .get('/my-endpoint')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
```

**Available Test Helpers:**
- `setupTestSuite()` - Handles app initialization, database cleanup, and teardown
- `createTestUser(app, userData)` - Creates a user directly in the database
- `getAuthToken(app, credentials)` - Authenticates and returns JWT token
- `createAuthenticatedUser(app, userData)` - Creates user and returns token in one step

### Unit Tests

Run unit tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:cov
```

## Project Structure

```
core/
├── src/
│   ├── authors/        # Author entity and module
│   ├── books/          # Book entity and module
│   ├── loan/           # Loan entity and module
│   ├── users/          # User entity and module
│   ├── migrations/     # TypeORM migrations
│   └── data-source.ts  # TypeORM configuration
```

## License

[MIT License](LICENSE)
