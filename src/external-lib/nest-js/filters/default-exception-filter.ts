import { errorMessage } from '../../../shared/constants';
import { getCurrentUTCDate } from '../../../shared/utils';
import { AnyObj, IHttpResponse } from '../../../shared/types';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch(Error)
export class DefaultExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const responseBody: IHttpResponse = {
      data: null,
      timestamp: getCurrentUTCDate(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        logMessage: exception.message,
        displayMessage: errorMessage.DEFAULT_ERROR,
      },
    };

    if (exception instanceof HttpException) {
      const httpResponse: AnyObj = <any>exception.getResponse();

      // status code
      responseBody.statusCode = exception.getStatus();

      // display message
      if (httpResponse?.message) {
        if (Array.isArray(httpResponse?.message)) {
          responseBody.error!.displayMessage = httpResponse.message[0];
        } else {
          responseBody.error!.displayMessage = httpResponse.message;
        }
      }

      // log message
      responseBody.error!.logMessage = (exception.cause ?? exception.stack ?? '').toString();
    }

    response.status(responseBody.statusCode).json(responseBody);
  }
}
