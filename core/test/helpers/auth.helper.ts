import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import type { Server } from 'http';
import { User } from '../../src/users/user.entity';
import { UserRole } from '../../src/users/user.constants';
import { SignUpDto } from '../../src/auth/dto/sign-up.dto';
import { SignInDto } from '../../src/auth/dto/sign-in.dto';
import { AuthResponseDto } from '../../src/auth/dto/auth-response.dto';

/**
 * Creates a test user directly in the database.
 * Password is hashed using bcrypt with salt rounds 10.
 */
export async function createTestUser(
  app: INestApplication,
  userData: Partial<SignUpDto> & { password?: string } = {},
): Promise<User> {
  const dataSource = app.get(DataSource);
  const userRepository = dataSource.getRepository(User);

  const hashedPassword = await bcrypt.hash(
    userData.password || 'password123',
    10,
  );

  const user = userRepository.create({
    email: userData.email || `test-${Date.now()}@example.com`,
    password: hashedPassword,
    name: userData.name || 'Test User',
    role: userData.role || UserRole.MEMBER,
  });

  return await userRepository.save(user);
}

/**
 * Type guard to validate AuthResponseDto structure
 */
function isAuthResponse(body: unknown): body is AuthResponseDto {
  return (
    typeof body === 'object' &&
    body !== null &&
    'access_token' in body &&
    typeof (body as AuthResponseDto).access_token === 'string'
  );
}

/**
 * Authenticates a user and returns the JWT access token.
 * Uses the /auth/signin endpoint.
 */
export async function getAuthToken(
  app: INestApplication,
  credentials: SignInDto,
): Promise<string> {
  const server = app.getHttpServer() as Server;
  const response = await request(server)
    .post('/auth/signin')
    .send(credentials)
    .expect(200);

  if (!isAuthResponse(response.body)) {
    throw new Error('Invalid auth response structure');
  }

  return response.body.access_token;
}

/**
 * Creates a test user and returns their auth token in one step.
 * Useful for quickly setting up authenticated test scenarios.
 */
export async function createAuthenticatedUser(
  app: INestApplication,
  userData: Partial<SignUpDto> & { password?: string } = {},
): Promise<{ user: User; token: string }> {
  const password = userData.password || 'password123';
  const user = await createTestUser(app, { ...userData, password });

  const token = await getAuthToken(app, {
    email: user.email,
    password,
  });

  return { user, token };
}
