import { User } from '../../domain/core/entities/user';
import { UserResponse } from '../response/user-response';
import { FindAllResponse } from '../../../../shared/types';

export abstract class UserPresenter {
  abstract domainToPresentation(domain: User): UserResponse;
  abstract findAllDomainToPresentation(
    domain: FindAllResponse<User>
  ): FindAllResponse<UserResponse>;
}
