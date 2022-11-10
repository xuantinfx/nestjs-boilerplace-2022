import { User } from './user.entity';

export const userProviderTokens = {
  USER_REPOSITORY: 'UserRepository',
};

export const providers = [
  { provide: userProviderTokens.USER_REPOSITORY, useValue: User },
];
