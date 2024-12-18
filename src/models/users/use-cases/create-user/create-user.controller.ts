import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserService } from './create-user.service';
import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserResponseDto } from './create-user.response.dto';

@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  async handle(
    @Body() data: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return this.createUserService.execute(data);
  }
}
