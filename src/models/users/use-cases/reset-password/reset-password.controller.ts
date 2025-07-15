import { Body, Controller, HttpStatus, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordRequestDto } from './reset-password.request.dto';
import { ResetPasswordResponseDto } from './reset-password.response.dto';
import { Public } from '@/decorators/public-route.decorator';

@ApiTags('Users')
@Public()
@Controller('users')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @ApiOperation({ summary: 'Reset user password using token' })
  @ApiOkResponse({
    description: 'Password reset successfully',
    example: {
      statusCode: HttpStatus.OK,
      message: 'Password reset successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request parameters',
    example: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: [
        'token must be a UUID',
        'newPassword must be longer than or equal to 8 characters',
        'newPassword must be a string',
        'newPasswordConfirmation must be a string',
        "newPassword and newPasswordConfirmation don't match",
      ],
      error: 'Bad Request',
    },
  })
  @ApiNotFoundResponse({
    description: 'Token not found or expired',
    example: {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Token not found',
    },
  })
  @Patch('reset-password')
  async handle(
    @Body() body: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.resetPasswordService.execute(body);
  }
}
