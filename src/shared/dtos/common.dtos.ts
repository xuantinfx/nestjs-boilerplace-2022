import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { ErrorCodeResponse } from '../exceptions/error-codes';

/**
 * Default find arguments.
 */
export class FindArgs {
  @ApiProperty({
    required: false,
    description: 'search/filter data by ids',
  })
  ids?: string | string[];

  @ApiProperty({
    required: false,
    description: 'search data by ?q=',
  })
  q?: string;

  @ApiProperty({
    required: false,
    description: 'offset',
    default: 0,
  })
  @Type(() => Number)
  offset = 0;

  @ApiProperty({
    required: false,
    description: 'limit',
    default: 100,
  })
  @Type(() => Number)
  limit = 100;

  @ApiProperty({
    required: false,
    description: 'Order result, e.g. order=createdAt:DESC',
  })
  order?: string;
}

/**
 * Pagination Result
 */
export class PaginationResult<T> {
  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty({
    type: Boolean,
  })
  hasNext = false;

  items: T[];
}

/**
 * Generate pagination result
 */
export function genPaginationResult<T>(
  items: T[],
  total: number,
  offset: number,
  limit: number,
): PaginationResult<T> {
  const result = new PaginationResult<T>();

  result.offset = offset;
  result.limit = limit;
  result.total = total;
  result.hasNext = result.offset + result.limit < result.total;
  result.items = items;

  return result;
}

/**
 * Generate empty page result
 */
export function genEmptyPage<T>(args: FindArgs): PaginationResult<T> {
  return genPaginationResult([], 0, args.offset, args.offset);
}

export class CreatedObj {
  @ApiProperty({
    required: true,
  })
  id: string;
}

export class ErrorResponseBody {
  @ApiProperty({
    name: 'request_id',
    type: 'string',
    required: true,
  })
  request_id: string;
  @ApiProperty({
    name: 'message',
    type: 'string',
    required: true,
  })
  message: string;

  @ApiProperty({
    description: 'Available if http status code is 4XX',
    name: 'httpExceptionResponse',
    type: 'object',
    properties: {
      errorCode: {
        type: 'string',
      },
      message: {
        type: 'string',
      },
    },
  })
  httpExceptionResponse: ErrorCodeResponse;
}

export class AuditableResDto {
  @ApiProperty({
    required: true,
    type: Date,
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    required: false,
  })
  createdBy: string;

  @ApiProperty({
    required: false,
  })
  updatedBy: string;
}
