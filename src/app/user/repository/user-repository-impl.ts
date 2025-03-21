import { Injectable } from '@nestjs/common';
import { UserModel } from './models/user-model';
import { UserSchema } from './schemas/user-schema';
import { User } from '../domain/core/entities/user';
import { UserQueryOptions } from '../domain/dtos/user-query';
import { UserRepository } from './abstractions/user-repository';
import { BaseRepositoryImpl } from '../../../external-lib/mongo-db';
import { UserPersistenceMapper } from './mappers/user-persistence-mapper';

@Injectable()
export class UserRepositoryImpl
  extends BaseRepositoryImpl<User, UserSchema, UserQueryOptions>
  implements UserRepository
{
  constructor(
    protected model: UserModel,
    protected mapper: UserPersistenceMapper
  ) {
    super(model, mapper);
  }
}
