import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({ summary: 'Hello/Health check' })
  @Get()
  getHello() {
    return 'Hello World!';
  }
}
