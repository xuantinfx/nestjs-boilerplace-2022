import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';

import { HEADER } from './shared/constant/request';
import { HttRequestContextMiddleware } from './shared/http-request-context/http-request-context.middleware';
import { HttRequestContextModule } from './shared/http-request-context/http-request-context.module';
import { DbTransactionInterceptor } from './shared/interceptors/db-transaction.interceptor';
import { RequestIdHeaderMiddleware } from './shared/middlewares/request-id-header.middleware';
import { UsersModule } from './user/user.module';

// pino log levels: "debug" | "fatal" | "error" | "warn" | "info" | "trace"
const LOG_LVL = process.env.LOG_LVL || 'debug';

const loggerConfig = {
  // https://github.com/pinojs/pino-http
  imports: [],
  inject: [],
  useFactory: async () => {
    return {
      pinoHttp: {
        level: LOG_LVL,

        genReqId(req) {
          return req.headers[HEADER.X_REQUEST_ID];
        },

        serializers: {
          req(req) {
            const redactedReq = {
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.param,
              headers: {},
              remoteAddress: req.remoteAddress,
              remotePort: req.remotePort,
              body: {},
            };
            for (const header in req.headers) {
              if (HEADER.REDACTEDS.includes(header)) {
                redactedReq.headers[header] = HEADER.REDACTED_VALUE;
              } else {
                redactedReq.headers[header] = req.headers[header];
              }
            }
            const logLvl = LOG_LVL;
            if (logLvl === 'debug' || logLvl === 'trace') {
              redactedReq.body = req.raw.body;
            }
            return redactedReq;
          },
        },

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        customReceivedMessage(req, _res) {
          return 'Request received: ' + req.headers[HEADER.X_REQUEST_ID];
        },

        customSuccessMessage(res) {
          return 'Request completed: ' + res.req?.headers[HEADER.X_REQUEST_ID];
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        customErrorMessage(_error, res) {
          return 'Request errored: ' + res.req?.headers[HEADER.X_REQUEST_ID];
        },
      },
    };
  },
};

@Module({
  imports: [
    DatabaseModule,
    HttRequestContextModule,
    LoggerModule.forRootAsync(loggerConfig),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: DbTransactionInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdHeaderMiddleware, HttRequestContextMiddleware)
      .forRoutes('*');
  }
}
