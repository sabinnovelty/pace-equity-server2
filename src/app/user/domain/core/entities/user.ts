import { BaseEntity } from '../../../../../shared/entities';
import { getFullName, trimValue } from '../../../../../shared/utils';
import { HashedValue } from '../../../../../shared/entities/hashed-value';

export class User extends BaseEntity {
  username: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob?: string;
  password?: HashedValue;
  passwordHistory?: HashedValue[];
  loginAttempts?: number;
  lastLoginDate?: Date;
  status: UserStatus;

  initialize(builder: {
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dob?: string;
    password?: string;
  }) {
    this.email = builder.email;
    this.firstName = trimValue(builder.firstName);
    this.dob = builder.dob;
    if (builder.middleName) {
      this.middleName = trimValue(builder.middleName);
    }
    this.lastName = trimValue(builder.lastName);
    this.status = UserStatus.INACTIVE;
    if (builder.password) {
      this.password = HashedValue.fromValue(builder.password);
    }
  }

  get fullName(): string {
    return getFullName({
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
    });
  }

  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  activate(password: string): void {
    this.status = UserStatus.ACTIVE;
    this.password = HashedValue.fromValue(password);
  }

  initiateActivation() {
    this.status = UserStatus.PENDING_ACTIVATION;
  }

  disable() {
    this.status = UserStatus.INACTIVE;
  }

  logout(): void {
    this.loginAttempts = 0;
  }

  private _failedLogin(): void {
    if (this.loginAttempts) {
      this.loginAttempts++;
    } else {
      this.loginAttempts = 1;
    }
  }
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_ACTIVATION = 'pending_activation',
}
