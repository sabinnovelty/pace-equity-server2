import { SetMetadata } from '@nestjs/common';
import { AuthorizationPayload } from '../../../shared/domain/types/authorization';

export const AUTHORIZATION_KEY = 'authorization';
export const Authorize = (payload: AuthorizationPayload) => SetMetadata(AUTHORIZATION_KEY, payload);
