import { Injectable } from '@nestjs/common';
import { UserSchema } from '../schemas/user-schema';
import { User } from '../../domain/core/entities/user';
import { AnyObj, DBQuery } from '../../../../shared/types';
import { withoutEmptyValues } from '../../../../shared/utils';
import { UserQueryOptions } from '../../domain/dtos/user-query';
import { HashedValue } from '../../../../shared/entities/hashed-value';
import { BasePersistenceMapper } from '../../../../shared/abstractions';

@Injectable()
export class UserPersistenceMapper extends BasePersistenceMapper<User, UserSchema> {
  domainToPersistence(domain: User): UserSchema {
    return {
      userId: domain.id,
      email: domain.email,
      status: domain.status,
      demographic: {
        dob: domain.dob,
        name: {
          lastName: domain.lastName,
          firstName: domain.firstName,
          middleName: domain.middleName,
        },
      },
      security: {
        password: domain.password?.hash,
        loginAttempts: domain.loginAttempts,
        lastLoginDate: domain.lastLoginDate,
        passwordHistory: domain.passwordHistory?.map(ph => ph.hash),
      },
      created: domain.created,
      updated: domain.updated,
    };
  }

  persistenceToDomain(persistence: UserSchema): User {
    const domain = new User(persistence.userId);

    domain.email = persistence.email;

    domain.status = persistence.status;

    // demographics
    domain.firstName = persistence.demographic.name.firstName;
    domain.middleName = persistence.demographic.name.middleName;
    domain.lastName = persistence.demographic.name.lastName;
    domain.dob = persistence.demographic.dob;

    // security
    domain.loginAttempts = persistence.security?.loginAttempts;
    domain.lastLoginDate = persistence.security?.lastLoginDate;
    if (persistence.security?.password)
      domain.password = new HashedValue(persistence.security.password);
    if (persistence.security?.passwordHistory)
      domain.passwordHistory = persistence.security?.passwordHistory.map(ph => new HashedValue(ph));

    domain.created = persistence.created;
    domain.updated = persistence.updated;

    return domain;
  }

  updateDomainToPeristence(domain: Partial<User>): Partial<UserSchema> | AnyObj {
    return withoutEmptyValues({
      email: domain.email,
      'demographic.dob': domain.dob,
      'demographic.name.lastName': domain.lastName,
      'demographic.name.firstName': domain.firstName,
      'demographic.name.middleName': domain.middleName,
    } as Partial<UserSchema>);
  }

  mapQuery(query: UserQueryOptions): DBQuery<UserSchema> {
    return withoutEmptyValues({
      ...query,
      email: query.email,
      'demographic.name.lastName': query.lastName,
      'demographic.name.firstName': query.firstName,
    } as DBQuery<UserSchema>);
  }
}
