import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.getDatabaseConfig(),
      inject: [ConfigService],
    }),
    AuthModule,
    AuthorsModule,
    BooksModule,
    UsersModule,
  ],
  controllers: [BooksController],
  providers: [
    BooksService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
