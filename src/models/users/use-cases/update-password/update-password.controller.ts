import { Body, Controller, HttpStatus, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UpdatePasswordService } from './update-password.service';
import { Payload } from '@/decorators/payload.decorator';
import { UpdatePasswordRequestDto } from './update-password.request.dto';
import { UpdatePasswordResponseDto } from './update-password.response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UpdatePasswordController {
  constructor(private readonly updatePasswordService: UpdatePasswordService) {}

  @ApiOperation({ summary: 'Update user password' })
  @ApiOkResponse({
    description: 'User password updated successfully',
    example: {
      statusCode: HttpStatus.OK,
      message: 'User password updated successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request parameters',
    example: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: [
        'currentPassword must be a string',
        'newPassword must be longer than or equal to 8 characters',
        'newPassword must be a string',
        'newPasswordConfirmation must be a string',
        "newPassword and newPasswordConfirmation don't match",
      ],
      error: 'Bad Request',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
    },
  })
  @ApiForbiddenResponse({
    description: 'Current password is incorrect',
    example: {
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Current password is incorrect',
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    example: {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'User not found',
    },
  })
  @Patch('password')
  async handle(
    @Payload('sub') id: string,
    @Body() body: UpdatePasswordRequestDto,
  ): Promise<UpdatePasswordResponseDto> {
    return this.updatePasswordService.execute(id, body);
  }
}
