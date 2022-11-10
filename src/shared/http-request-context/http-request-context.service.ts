import { Injectable, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { CurrentUser } from 'src/auth/current-user';

import { HEADER } from '../constant/request';

export class HttpRequestContext {
  constructor(
    public requestId?: string,
    public user?: CurrentUser,
    public systemId?: string,
    public transaction?: Transaction,
  ) {}
}

@Injectable()
export class HttpRequestContextService {
  private static asyncLocalStorage =
    new AsyncLocalStorage<HttpRequestContext>();

  private readonly logger = new Logger(HttpRequestContextService.name);

  runWithContext(req: Request, _res: Response, next: NextFunction) {
    const context = new HttpRequestContext();
    context.requestId = req.headers[HEADER.X_REQUEST_ID] as string;
    this.logger.debug(`----- Run with context %j`, context);
    HttpRequestContextService.asyncLocalStorage.run(context, () => {
      next();
    });
  }

  getRequestId() {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();

    return reqContext?.requestId;
  }

  setRequestId(id: string) {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();

    reqContext.requestId = id;
  }

  getUser() {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();

    this.logger.debug(`Context is %j`, reqContext);

    return reqContext?.user;
  }

  setUser(user: CurrentUser) {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();

    this.logger.debug(`-----Context BEFORE is %j`, reqContext);

    reqContext.user = user;

    this.logger.debug(`-----Context AFTER is %j`, reqContext);
  }

  getDbTransaction() {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();

    const transaction: Transaction = reqContext?.transaction;

    if (!transaction) {
      // No transaction yet. Create a new one
      this.setDbTransaction(transaction);
    }

    return transaction;
  }

  setDbTransaction(transaction: Transaction) {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();

    reqContext.transaction = transaction;
  }
}
