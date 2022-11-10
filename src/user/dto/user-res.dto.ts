import { ApiProperty } from '@nestjs/swagger';
import { PaginationResult } from 'src/shared/dtos/common.dtos';
import { UserStatus } from '../user.entity';

export class UserResDto {
  @ApiProperty({
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    required: true,
  })
  email: string;

  @ApiProperty({
    required: false,
  })
  firstName: string;

  @ApiProperty({
    required: false,
  })
  lastName: string;

  @ApiProperty({
    required: true,
    enum: UserStatus,
  })
  status: UserStatus;
}

export class UserPaginationResult extends PaginationResult<UserResDto> {
  @ApiProperty({
    required: true,
    type: [UserResDto],
  })
  items: UserResDto[];
}
