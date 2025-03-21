export class DomainException extends Error {
  constructor(
    message: string,
    public detail?: any
  ) {
    super(message);

    Object.setPrototypeOf(this, DomainException.prototype);
  }
}
