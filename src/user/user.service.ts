import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { sign } from 'jsonwebtoken';
import { Sequelize } from 'sequelize';
import { JwtPayload } from 'src/auth/jwt-payload.model';
import { getChangeMakerValue } from 'src/shared/service-utils/service.utils';

import {
  genPaginationResult,
  PaginationResult,
} from '../shared/dtos/common.dtos';
import { HttpRequestContextService } from '../shared/http-request-context/http-request-context.service';
import { ServiceRepoUtils } from '../shared/service-utils/service-repo.utils';
import { UserFindArgs } from './dto/user-find-args.dto';
import { UserReqDto } from './dto/user-req.dto';
import { UserResDto } from './dto/user-res.dto';
import { User, UserStatus } from './user.entity';
import { userProviderTokens } from './user.providers';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly httpContext: HttpRequestContextService,
    @Inject(userProviderTokens.USER_REPOSITORY)
    private repository: typeof User,
  ) {}

  async get(id: string): Promise<UserResDto> {
    const entity = await this.repository.findByPk(id);
    if (!entity) {
      throw new NotFoundException();
    }

    return this.toResponseDto(entity);
  }

  async getUserByEmailCaseInsensitive(email: string): Promise<User> {
    if (!email) {
      return undefined;
    }

    return await this.repository.findOne<User>({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('email')),
        email.toLowerCase(),
      ),
    });
  }

  async getCacheable(id: string): Promise<UserResDto> {
    const cacheKey = `user.id.${id}`;
    let dto = (await this.cacheManager.get(cacheKey)) as UserResDto;

    if (!dto) {
      dto = await this.get(id);
      if (dto) {
        this.cacheManager.set(cacheKey, dto);
      }
    }

    return dto;
  }

  async getUserByEmailCacheable(email: string): Promise<User> {
    const cacheKey = `user.email.${email}`;
    let dto = (await this.cacheManager.get(cacheKey)) as User;

    if (!dto) {
      dto = await this.getUserByEmailCaseInsensitive(email);
      if (dto) {
        this.cacheManager.set(cacheKey, dto);
      }
    }

    return dto;
  }

  async ensure(dto: UserReqDto): Promise<User> {
    const existingUser = await this.getUserByEmailCaseInsensitive(dto.email);

    if (!existingUser) {
      this.logger.warn('Create the user %j', dto);

      const entity = await this.create(dto);

      return entity;
    }

    return existingUser;
  }

  async create(dto: UserReqDto): Promise<User> {
    this.logger.warn('Create the user %j', dto);

    const entity = await this.repository.create(
      {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        status: dto.status || UserStatus.ACTIVE,
        createdBy: getChangeMakerValue(this.httpContext),
      },
      { transaction: this.httpContext.getDbTransaction() },
    );

    return entity;
  }

  async find(args: UserFindArgs): Promise<PaginationResult<UserResDto>> {
    const extraConditions = this.genFindUserConditions(args);

    const qColumns = ['firstName', 'lastName', 'email'];
    const order = ServiceRepoUtils.genSequelizeOrder(args.order);

    const { rows, count } = await ServiceRepoUtils.findAllByArgs(
      this.repository,
      args,
      extraConditions,
      qColumns,
      order,
    );

    const items = rows.map((entity) => this.toResponseDto(entity));

    return genPaginationResult(items, count, args.offset, args.limit);
  }

  private genFindUserConditions(args: UserFindArgs) {
    const extraConditions = [];

    if (args.status) {
      extraConditions.push({ status: args.status });
    }

    return extraConditions;
  }

  private toResponseDto(entity: User): UserResDto {
    const { id, email, firstName, lastName, status } = entity;

    const dto: UserResDto = {
      id,
      email,
      firstName,
      lastName,
      status,
    };

    return dto;
  }

  async signJWTToken(user: User): Promise<string> {
    const expAfterSeconds = +process.env.JWT_EXPIRE_IN_SECOND || 604800;
    return this.signToken(user, expAfterSeconds);
  }

  async signToken(user: User, expAfterSeconds: number): Promise<string> {
    this.logger.debug(
      'Sign token for the user %j. expAfterSeconds: %j',
      user.email,
      expAfterSeconds,
    );
    const jwtPrivateKey = process.env.JWT_PRIVATE_KEY || 'Ch@ngeMeOnProdEnv';

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      iat: Date.now(),
      exp: Date.now() + expAfterSeconds * 1000,
    };

    return sign(payload, jwtPrivateKey, {});
  }
}
