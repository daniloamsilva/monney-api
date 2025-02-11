import { Body, Controller, Patch } from '@nestjs/common';

import { Payload } from '@/decorators/payload.decorator';
import { UpdateNameRequestDto } from './update-name.request.dto';
import { UpdateNameService } from './update-name.service';
import { UpdateNameResponseDto } from './update-name.response.dto';

@Controller('users')
export class UpdateNameController {
  constructor(private readonly updateNameService: UpdateNameService) {}

  @Patch('name')
  async handle(
    @Payload('sub') id: string,
    @Body() body: UpdateNameRequestDto,
  ): Promise<UpdateNameResponseDto> {
    return this.updateNameService.execute(id, body);
  }
}
