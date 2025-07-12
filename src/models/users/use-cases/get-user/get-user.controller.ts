import { Controller, Get } from '@nestjs/common';

import { GetUserService } from './get-user.service';
import { Payload } from '@/decorators/payload.decorator';

@Controller('users')
export class GetUserController {
  constructor(private readonly getUserService: GetUserService) {}

  @Get()
  async handle(@Payload('sub') id: string) {
    return this.getUserService.execute(id);
  }
}
