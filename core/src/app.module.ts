import { Module } from '@nestjs/common';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.getDatabaseConfig(),
      inject: [ConfigService],
    }),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class AppModule {}
