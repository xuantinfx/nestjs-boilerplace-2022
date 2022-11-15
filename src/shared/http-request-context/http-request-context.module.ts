import { Global, Module } from '@nestjs/common';

import { HttRequestContextMiddleware } from './http-request-context.middleware';
import { HttpRequestContextService } from './http-request-context.service';

@Global()
@Module({
  providers: [HttpRequestContextService, HttRequestContextMiddleware],
  exports: [HttpRequestContextService, HttRequestContextMiddleware],
})
export class HttRequestContextModule {}
