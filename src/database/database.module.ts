import { Module } from '@nestjs/common';

import { ConnectionShutdownService } from './connection-shutdown.service';
import { databaseProviders } from './database.providers';

@Module({
  providers: [...databaseProviders, ConnectionShutdownService],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
