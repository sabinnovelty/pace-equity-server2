import { errorMessage } from '../constants';
import { DomainException } from './domain-exception';

export class ForbiddenException extends DomainException {
  constructor(message?: string, detail?: any) {
    super(message ?? errorMessage.UNAUTHORIZED_ACCESS, detail);

    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}
