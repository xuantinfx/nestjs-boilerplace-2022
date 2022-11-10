import { CacheModule, Module } from '@nestjs/common';
import { JwtStrategy } from 'src/auth/jwt-strategy';

import { DatabaseModule } from '../database/database.module';
import { UsersController } from './user.controller';
import { providers } from './user.providers';
import { UserService } from './user.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 10, // seconds
      max: 1000, // maximum number of items in cache
    }),
    DatabaseModule,
  ],
  controllers: [UsersController],
  providers: [UserService, ...providers, JwtStrategy],
  exports: [UserService],
})
export class UsersModule {}
