import request, { Response } from 'supertest';
import { setupTestSuite } from './helpers/test-suite.helper';
import { createTestUser } from './helpers/auth.helper';
import { UserRole } from '../src/users/user.constants';
import { AuthResponseDto } from '../src/auth/dto/auth-response.dto';

describe('AuthController (e2e)', () => {
  const testSuite = setupTestSuite();

  describe('POST /auth/signup', () => {
    it('should register a new user successfully', async () => {
      const signUpData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const response: Response = await request(
        testSuite.getApp().getHttpServer(),
      )
        .post('/auth/signup')
        .send(signUpData)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof (response.body as AuthResponseDto).access_token).toBe(
        'string',
      );
    });

    it('should register a user with a specific role', async () => {
      const signUpData = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
      };

      const response = await request(testSuite.getApp().getHttpServer())
        .post('/auth/signup')
        .send(signUpData)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
    });

    it('should fail with invalid email', async () => {
      const signUpData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      await request(testSuite.getApp().getHttpServer())
        .post('/auth/signup')
        .send(signUpData)
        .expect(400);
    });

    it('should fail with short password', async () => {
      const signUpData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      };

      await request(testSuite.getApp().getHttpServer())
        .post('/auth/signup')
        .send(signUpData)
        .expect(400);
    });

    it('should fail with missing name', async () => {
      const signUpData = {
        email: 'john@example.com',
        password: 'password123',
      };

      await request(testSuite.getApp().getHttpServer())
        .post('/auth/signup')
        .send(signUpData)
        .expect(400);
    });

    it('should fail when email already exists', async () => {
      const signUpData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // First registration should succeed
      await request(testSuite.getApp().getHttpServer())
        .post('/auth/signup')
        .send(signUpData)
        .expect(201);

      // Second registration with same email should fail with 409 Conflict
      await request(testSuite.getApp().getHttpServer())
        .post('/auth/signup')
        .send(signUpData)
        .expect(409);
    });
  });

  describe('POST /auth/signin', () => {
    it('should sign in an existing user successfully', async () => {
      const password = 'password123';
      const user = await createTestUser(testSuite.getApp(), {
        email: 'john@example.com',
        password,
        name: 'John Doe',
      });

      const signInData = {
        email: user.email,
        password,
      };

      const response = await request(testSuite.getApp().getHttpServer())
        .post('/auth/signin')
        .send(signInData)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof (response.body as AuthResponseDto).access_token).toBe(
        'string',
      );
    });

    it('should fail with incorrect password', async () => {
      const user = await createTestUser(testSuite.getApp(), {
        email: 'john@example.com',
        password: 'password123',
        name: 'John Doe',
      });

      const signInData = {
        email: user.email,
        password: 'wrongpassword',
      };

      await request(testSuite.getApp().getHttpServer())
        .post('/auth/signin')
        .send(signInData)
        .expect(401);
    });

    it('should fail with non-existent email', async () => {
      const signInData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      await request(testSuite.getApp().getHttpServer())
        .post('/auth/signin')
        .send(signInData)
        .expect(401);
    });

    it('should fail with invalid email format', async () => {
      const signInData = {
        email: 'invalid-email',
        password: 'password123',
      };

      await request(testSuite.getApp().getHttpServer())
        .post('/auth/signin')
        .send(signInData)
        .expect(400);
    });

    it('should fail with missing credentials', async () => {
      await request(testSuite.getApp().getHttpServer())
        .post('/auth/signin')
        .send({})
        .expect(400);
    });
  });

  describe('JWT Token', () => {
    it('should return a valid JWT token that can be decoded', async () => {
      const signUpData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const response = await request(testSuite.getApp().getHttpServer())
        .post('/auth/signup')
        .send(signUpData)
        .expect(201);

      const token = (response.body as AuthResponseDto).access_token;

      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      expect(parts).toHaveLength(3);

      // Decode the payload (second part)
      const payloadString = Buffer.from(parts[1], 'base64').toString();
      const payload = JSON.parse(payloadString) as {
        sub: number;
        email: string;
        role: string;
      };

      expect(payload).toHaveProperty('sub');
      expect(payload).toHaveProperty('email', signUpData.email);
      expect(payload).toHaveProperty('role');
    });
  });
});
