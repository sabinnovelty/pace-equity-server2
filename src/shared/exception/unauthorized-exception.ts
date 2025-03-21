import { errorMessage } from '../constants';
import { DomainException } from './domain-exception';

export class UnauthorizedException extends DomainException {
  constructor(message?: string, detail?: any) {
    super(message ?? errorMessage.UNAUTHENTICATED_ACCESS, detail);

    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}
