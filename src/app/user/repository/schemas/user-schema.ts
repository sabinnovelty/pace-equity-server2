import { UserStatus } from '../../domain/core/entities/user';
import { BaseSchema } from '../../../../external-lib/mongo-db/interface';

export interface IUser {
  userId: string;
  email: string;
  demographic: {
    name: { firstName: string; lastName: string; middleName?: string };
    dob?: string;
  };
  status: UserStatus;
  security?: UserSecurity;
}

export type UserSecurity = {
  password?: string;
  passwordHistory?: string[];
  loginAttempts?: number;
  lastLoginDate?: Date;
  enableMFA?: boolean;
};

export type UserSchema = IUser & BaseSchema;
