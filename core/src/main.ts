import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp, setupSwagger } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply common app configuration
  configureApp(app);

  // Setup Swagger documentation
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
