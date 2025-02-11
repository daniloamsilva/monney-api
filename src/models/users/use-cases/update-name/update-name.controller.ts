import { Body, Controller, HttpStatus, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Payload } from '@/decorators/payload.decorator';
import { UpdateNameRequestDto } from './update-name.request.dto';
import { UpdateNameService } from './update-name.service';
import { UpdateNameResponseDto } from './update-name.response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UpdateNameController {
  constructor(private readonly updateNameService: UpdateNameService) {}

  @ApiOperation({ summary: 'Update user name' })
  @ApiOkResponse({
    description: 'User name updated successfully',
    example: {
      statusCode: HttpStatus.OK,
      message: 'User name updated successfully',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    example: {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'User not found',
    },
  })
  @Patch('name')
  async handle(
    @Payload('sub') id: string,
    @Body() body: UpdateNameRequestDto,
  ): Promise<UpdateNameResponseDto> {
    return this.updateNameService.execute(id, body);
  }
}
