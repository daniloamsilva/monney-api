import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetUserService } from './get-user.service';
import { Payload } from '@/decorators/payload.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class GetUserController {
  constructor(private readonly getUserService: GetUserService) {}

  @ApiOperation({ summary: 'Get logged user details' })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    example: {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: {
        id: '0197fbf9-06a1-770f-b8c4-5525f50e237e',
        name: 'John Doe',
        email: 'johndoe@email.com',
        confirmedAt: null,
        createdAt: '2025-07-12T00:11:30.847Z',
        updatedAt: '2025-07-12T00:11:30.847Z',
        deletedAt: null,
      },
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
  @Get('me')
  async handle(@Payload('sub') id: string) {
    return this.getUserService.execute(id);
  }
}
