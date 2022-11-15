import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty } from 'class-validator';
import { AuthProvidersEnum } from '../auth-providers.enum';

export class AuthSocialLoginDto {
  @ApiProperty({ enum: AuthProvidersEnum })
  @IsNotEmpty()
  socialType: AuthProvidersEnum;

  @Allow()
  @ApiProperty({ required: false })
  firstName?: string;

  @Allow()
  @ApiProperty({ required: false })
  lastName?: string;
}
