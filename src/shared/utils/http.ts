import { HttpRequest, IHttpResponse } from '../types';

/**
 * Constructs an HTTP response object with the given data and message.
 * @param data The data to include in the response.
 * @param message A message to include in the response.
 * @returns The constructed HTTP response object containing the data and message.
 */
export function buildHttpResponse<T>(data: T, message: string): IHttpResponse<T> {
  return {
    data,
    message,
  };
}

/**
 * Fetch ip of the requesting client
 * @param request the request object
 * @returns ip of the requesting client
 */
export function getIpFromRequest(request: HttpRequest): string {
  let ip = request.ip || 'N/A',
    ips: string[] = [];
  const xForwardedFor = request.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string') {
    ips = xForwardedFor.split(',');
  } else if (typeof xForwardedFor === 'object') {
    ips = xForwardedFor;
  }
  ip = ips.length ? ips[0]?.trim() || ip : ip;
  if (ip === '::1') return '127.0.0.1'; //localhost

  return ip;
}
