import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Configures the NestJS application with common settings.
 * Used in both main.ts (production) and e2e tests to ensure consistency.
 */
export function configureApp(app: INestApplication): INestApplication {
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  return app;
}

/**
 * Sets up Swagger documentation.
 * Only used in main.ts, not in tests.
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('LLM Renderer API')
    .setDescription('API documentation for LLM Renderer')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
