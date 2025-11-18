import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { DomainError } from '@src/shared/domain/DomainError';

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = HttpStatus.BAD_REQUEST;
    const message = exception.message ?? 'Bad Request';

    res.status(status).json({
      statusCode: status,
      message,
    });
  }
}
