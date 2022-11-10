import { ApiProperty } from '@nestjs/swagger';
import { FindArgs } from '../../shared/dtos/common.dtos';
import { UserStatus } from '../user.entity';

export class UserFindArgs extends FindArgs {
  @ApiProperty({
    required: false,
    enum: UserStatus,
  })
  status?: UserStatus;
}
