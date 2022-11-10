import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationResult } from 'src/shared/dtos/common.dtos';
import { UserFindArgs } from './dto/user-find-args.dto';
import { UserPaginationResult, UserResDto } from './dto/user-res.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get(['me', 'userinfo'])
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Return current user information based on a token' })
  @ApiOkResponse({ type: UserResDto })
  async getUser(@Req() request): Promise<UserResDto> {
    return this.userService.get(request.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ type: UserResDto })
  @ApiParam({ name: 'id', required: true })
  get(@Req() request, @Param('id') id: string): Promise<UserResDto> {
    return this.userService.get(id);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ type: UserPaginationResult })
  list(@Query() args: UserFindArgs): Promise<PaginationResult<UserResDto>> {
    return this.userService.find(args);
  }
}
