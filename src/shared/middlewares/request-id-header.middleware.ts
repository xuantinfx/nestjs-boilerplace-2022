import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { HEADER } from '../constant/request';

@Injectable()
export class RequestIdHeaderMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestIdHeaderMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // This is temporary solution until we have our reverse proxy / gateway to generate an value as request id per request

    req.headers[HEADER.X_REQUEST_ID] =
      req.headers[HEADER.X_REQUEST_ID] || uuid();
    next();
  }
}
