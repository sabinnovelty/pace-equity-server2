import { User } from '../../domain/core/entities/user';
import { UserQueryOptions } from '../../domain/dtos/user-query';
import { BaseRepository } from '../../../../shared/abstractions';

export abstract class UserRepository extends BaseRepository<User, UserQueryOptions> {}
