import { AnyObj, AuthEntity } from '../types';

export interface IHttpRequestOptions {
  headers?: AnyObj<string>;
  params?: AnyObj<string>;
  authEntity?: AuthEntity;
}

export abstract class HttpRequestHelper {
  abstract init(baseUrl: string): void;
  abstract get(urlSuffix: string, options?: IHttpRequestOptions): Promise<any>;
  abstract post(urlSuffix: string, data?: AnyObj, options?: IHttpRequestOptions): Promise<any>;
  abstract put(urlSuffix: string, data?: AnyObj, options?: IHttpRequestOptions): Promise<any>;
  abstract delete(urlSuffix: string, options?: IHttpRequestOptions): Promise<any>;
  abstract patch(urlSuffix: string, data?: AnyObj, options?: IHttpRequestOptions): Promise<any>;
}

export default HttpRequestHelper;
