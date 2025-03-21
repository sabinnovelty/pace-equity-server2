import { IHttpResponse } from '../../../shared/types';
import { getCurrentUTCDate } from '../../../shared/utils';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import {
  BadRequestException,
  ConflictException,
  DomainException,
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const responseBody: IHttpResponse = {
      data: null,
      timestamp: getCurrentUTCDate(),
      statusCode: this.getStatusCodeForDomainException(exception),
      error: {
        logMessage: exception.detail,
        displayMessage: exception.message,
      },
    };
    response.status(responseBody.statusCode).json(responseBody);
  }

  private getStatusCodeForDomainException(exception: unknown): number {
    if (exception instanceof ConflictException) return HttpStatus.CONFLICT;
    if (exception instanceof ForbiddenException) return HttpStatus.FORBIDDEN;
    if (exception instanceof UnauthorizedException) return HttpStatus.UNAUTHORIZED;
    if (exception instanceof NotFoundException) return HttpStatus.NOT_FOUND;
    if (exception instanceof BadRequestException) return HttpStatus.BAD_REQUEST;

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
