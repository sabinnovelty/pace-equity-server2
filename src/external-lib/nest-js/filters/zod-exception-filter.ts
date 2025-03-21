import { ZodValidationException } from 'nestjs-zod';
import { IHttpResponse } from '../../../shared/types';
import { formatZodDislpayError, getCurrentUTCDate } from '../../../shared/utils';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

@Catch(ZodValidationException)
export class ZodExceptionFilter<T extends ZodValidationException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.BAD_REQUEST;

    const responseBody: IHttpResponse = {
      data: null,
      statusCode: status,
      timestamp: getCurrentUTCDate(),
      error: {
        logMessage: exception.getZodError().format(),
        displayMessage: formatZodDislpayError(exception.getZodError()),
      },
    };

    response.status(status).json(responseBody);
  }
}
