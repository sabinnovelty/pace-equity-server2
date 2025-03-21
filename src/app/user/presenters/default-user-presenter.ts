import { Injectable } from '@nestjs/common';
import { User } from '../domain/core/entities/user';
import { UserResponse } from './response/user-response';
import { FindAllResponse } from '../../../shared/types';
import { UserPresenter } from './abstractions/user-presenter';

@Injectable()
export class DefaultUserPresenter implements UserPresenter {
  domainToPresentation(domain: User): UserResponse {
    return {
      id: domain.id,
      dob: domain.dob,
      email: domain.email,
      lastName: domain.lastName,
      firstName: domain.firstName,
      middleName: domain.middleName,
    };
  }

  findAllDomainToPresentation(domain: FindAllResponse<User>): FindAllResponse<UserResponse> {
    return domain.map(d => this.domainToPresentation(d));
  }
}
