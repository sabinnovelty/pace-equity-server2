import { User } from '../core/entities/user';
import { CreateUserDto } from '../dtos/create-user';
import { UpdateUserDto } from '../dtos/update-user';
import { UserQueryOptions } from '../dtos/user-query';
import { BaseService } from '../../../../shared/abstractions';

export abstract class UserService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto,
  UserQueryOptions
> {}
