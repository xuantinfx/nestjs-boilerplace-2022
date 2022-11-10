import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, Observable, tap } from 'rxjs';
import { Transaction } from 'sequelize/types';
import { Sequelize } from 'sequelize-typescript';

import { HttpRequestContextService } from '../http-request-context/http-request-context.service';

@Injectable()
export class DbTransactionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DbTransactionInterceptor.name);

  constructor(
    @Inject('SEQUELIZE')
    private readonly sequelizeInstance: Sequelize,
    private readonly httpContext: HttpRequestContextService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const path = request.route?.path;
    const method = request.method;

    this.logger.debug(`----- method %j, path %j`, method, path);

    return next.handle().pipe(
      tap(async () => {
        const transaction: Transaction = this.httpContext.getDbTransaction();
        if (transaction) {
          this.logger.debug(`------- Commiting DB transaction`);
          await transaction.commit();
          this.logger.debug(`------- Committed DB transaction`);
        }
      }),
      catchError(async (err) => {
        const transaction: Transaction = this.httpContext.getDbTransaction();
        if (transaction) {
          this.logger.debug(`------- Rolling back DB transaction`);
          await transaction.rollback();
          this.logger.debug(`------- Rolled back DB transaction`);
        }

        throw err;
      }),
    );
  }
}
