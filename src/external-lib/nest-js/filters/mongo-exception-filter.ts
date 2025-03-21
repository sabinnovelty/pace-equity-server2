import { MongoServerError } from 'mongodb';
import { IHttpResponse } from '../../../shared/types';
import { errorMessage } from '../../../shared/constants';
import { getCurrentUTCDate } from '../../../shared/utils';
import { formatMongoDispalyError } from '../../../shared/utils';
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch(MongoServerError)
export class MongoDBExceptionFilter<T extends MongoServerError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.BAD_REQUEST;

    const formattedError = formatMongoDispalyError(exception);

    const responseBody: IHttpResponse = {
      data: null,
      statusCode: status,
      timestamp: getCurrentUTCDate(),
      error: {
        logMessage: formattedError,
        displayMessage: errorMessage.DEFAULT_ERROR,
      },
    };

    response.status(status).json(responseBody);
  }
}
