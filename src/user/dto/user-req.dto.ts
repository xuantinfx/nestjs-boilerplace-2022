import { ApiProperty } from '@nestjs/swagger';
import { UserSource, UserStatus } from '../user.entity';

export class UserReqDto {
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
  status?: UserStatus;

  source: UserSource;
}
