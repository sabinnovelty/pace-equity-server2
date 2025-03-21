import { CountResponse } from '../types';
import { RedisPrefix } from './cache-constant';
import errorMessage from './messages/error-message';
import successMessage from './messages/success-message';

export { successMessage, errorMessage, RedisPrefix };

export const APP_NAME = 'GoLD V2';

export const SYSTEM = 'System';
export const SOFT_DELETION_FIELD = 'deleted';

export const S3_UPLOAD_PRESIGNED_URL_EXPIRY = 5 * 60;

// Cookies
export const ACCESS_TOKEN_COOKIE_KEY = 'accessToken';

// Headers
export const AUTHORIZATION_HEADER = 'authorization';

export const EMPTY_COUNT_RESPONSE: CountResponse = {
  count: 0,
};
