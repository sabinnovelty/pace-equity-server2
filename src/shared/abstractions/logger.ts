import { AnyObj } from '../types/object';

export abstract class Logger {
  abstract info(message: string, meta?: AnyObj): void;
  abstract warn(message: string, meta?: AnyObj): void;
  abstract error(message: string, meta?: AnyObj): void;
  abstract debug(message: string, meta?: AnyObj): void;
}
