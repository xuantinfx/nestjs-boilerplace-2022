import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ConnectionShutdownService implements OnApplicationShutdown {
  private readonly logger = new Logger(ConnectionShutdownService.name);

  constructor(
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
  ) {}
  // Needed to release DB connection, especially in jest tests
  async onApplicationShutdown(signal: string) {
    this.logger.log(`---- On App shutdown with signal ${signal}`); // e.g. "SIGINT"
    await this.sequelize.close();
  }
}
