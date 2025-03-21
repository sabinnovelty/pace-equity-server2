import { User } from '../../app/user/domain/core/entities/user';

export abstract class UserEvent {
  constructor(
    public user: User,
    public createdAt: Date
  ) {}
}
