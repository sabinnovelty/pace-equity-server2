import { errorMessage } from '../constants';
import { AuthEntity, ServiceOption } from '../types';
import { UnauthorizedException } from '../exception/unauthorized-exception';

/**
 * Extracts userId from `ServiceOption`. If not found, throws an error.
 * @param serviceOption The service options containing authentication user information.
 * @returns The extracted `userId`.
 */
export function extractAuthPortfolioConcentrationLimitId(serviceOption: ServiceOption): string {
  const authEntity = extractAuthPortfolioConcentrationLimit(serviceOption);

  return authEntity.id;
}

/**
 * Extracts auth user from `ServiceOption`. If not found, throws an error.
 * @param serviceOption The service options containing authentication user information.
 * @returns The extracted authentication user.
 */
export function extractAuthPortfolioConcentrationLimit(serviceOption: ServiceOption): AuthEntity {
  const authEntity = serviceOption.authEntity;
  if (!authEntity) throw new UnauthorizedException(errorMessage.UNAUTHENTICATED_ACCESS);

  return authEntity;
}
