import * as Joi from 'joi';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      PORT: Joi.number().default(3000),
      DB_HOST: Joi.string().default('localhost'),
      DB_PORT: Joi.number().default(5432),
      DB_USER: Joi.string().default('user'),
      DB_PASSWORD: Joi.string().default('password'),
      DB_NAME: Joi.string().default('db'),
    });

    const validatedEnvConfig = envVarsSchema.validate(envConfig, {
      allowUnknown: true,
      stripUnknown: true,
    });

    if (validatedEnvConfig.error) {
      throw new Error(
        `Config validation error: ${validatedEnvConfig.error.message}`,
      );
    }

    return validatedEnvConfig.value as EnvConfig;
  }

  isProduction(): boolean {
    return this.envConfig.NODE_ENV === 'production';
  }

  getDatabaseConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.envConfig.DB_HOST,
      port: Number(this.envConfig.DB_PORT),
      username: this.envConfig.DB_USER,
      password: this.envConfig.DB_PASSWORD,
      database: this.envConfig.DB_NAME,
      autoLoadEntities: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    };
  }
}
