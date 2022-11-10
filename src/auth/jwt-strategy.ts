import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.model';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserStatus } from 'src/user/user.entity';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { CurrentUser } from './current-user';

const logger = new Logger();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly httpContext: HttpRequestContextService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_PRIVATE_KEY || 'Ch@ngeMeOnProdEnv',
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    const exp = payload.exp;

    if (exp && exp < Date.now()) {
      logger.warn(`The token is expired at %j`, new Date(exp));
      return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
    }

    const user = await this.userService.getUserByEmailCacheable(payload.email);

    if (!user || user.status !== UserStatus.ACTIVE) {
      logger.warn(`User %j is not found or not active %j`, user?.email);
      return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
    }

    const currUser: CurrentUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    this.httpContext.setUser(currUser);

    return done(null, currUser, payload.iat);
  }
}
