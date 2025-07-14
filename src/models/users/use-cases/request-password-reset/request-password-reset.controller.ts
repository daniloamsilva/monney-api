import { Body, Controller, Post } from '@nestjs/common';

import { RequestPasswordResetService } from './request-password-reset.service';
import { RequestPasswordResetRequestDto } from './request-password-reset.request.dto';
import { Public } from '@/decorators/public-route.decorator';

@Public()
@Controller('users')
export class RequestPasswordResetController {
  constructor(
    private readonly requestPasswordResetService: RequestPasswordResetService,
  ) {}

  @Post('request-password-reset')
  async handle(@Body() data: RequestPasswordResetRequestDto) {
    return this.requestPasswordResetService.execute(data);
  }
}
