import { HttpResponse } from '../types/http';

export abstract class CookieHelper {
  abstract set(res: HttpResponse, data: ICookieData[]): void;
  abstract clear(res: HttpResponse, key: string[]): void;
}

export interface ICookieData {
  name: string;
  value: any;
  expiryPeriodInMin?: number;
}
