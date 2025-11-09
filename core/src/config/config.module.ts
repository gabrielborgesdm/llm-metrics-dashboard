import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

// Determine which .env file to use based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(envFile),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
