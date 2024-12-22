import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserService } from './create-user.service';
import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserResponseDto } from './create-user.response.dto';

@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    example: {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request parameters',
    example: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: [
        'name must be a string',
        'email must be an email',
        'password must be longer than or equal to 8 characters',
        'password must be a string',
        'passwordConfirmation must be a string',
      ],
      error: 'Bad Request',
    },
  })
  @ApiConflictResponse({
    description: 'User already exists',
    example: {
      statusCode: HttpStatus.CONFLICT,
      message: 'User already exists',
      error: 'Conflict',
    },
  })
  @Post()
  async handle(
    @Body() data: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return this.createUserService.execute(data);
  }
}
