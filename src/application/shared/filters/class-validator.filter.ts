import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ClassValidatorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const excResponse = exception.getResponse();

    let message = 'Bad Request';

    if (typeof excResponse === 'string') {
      message = excResponse;
    } else if (excResponse && typeof excResponse === 'object') {
      const anyResp: any = excResponse;
      if (Array.isArray(anyResp.message)) {
        message = anyResp.message.join('; ');
      } else if (typeof anyResp.message === 'string') {
        message = anyResp.message;
      } else if (typeof anyResp.error === 'string') {
        message = anyResp.error;
      } else {
        message = exception.message ?? JSON.stringify(anyResp);
      }
    } else {
      message = exception.message ?? String(excResponse);
    }

    res.status(status).json({
      statusCode: status,
      message,
    });
  }
}
