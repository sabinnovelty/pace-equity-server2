import { errorMessage } from '../constants';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { BadRequestException } from '../exception';
import { cryptoConfig } from '../constants/crypto-config';

export class HashedValue {
  hash: string;

  constructor(hash: string) {
    this.hash = hash;
  }

  static fromValue(value: string) {
    return new HashedValue(HashedValue.hash(value));
  }

  private static hash(value: string, salt: Buffer = randomBytes(16)): string {
    // Generate the hash synchronously
    const hash = pbkdf2Sync(
      value,
      salt,
      cryptoConfig.hashIterations,
      cryptoConfig.hashKeylen,
      cryptoConfig.hashDigest
    );

    return hash.toString('hex') + cryptoConfig.delimiter + salt.toString('hex');
  }

  compare(value: string): boolean {
    const { salt: storedSalt, hash: storedHashedPassword } = this.detachSalt(this.hash);

    const hashedValue = HashedValue.hash(value, Buffer.from(storedSalt, 'hex'));
    const { hash: generatedHash } = this.detachSalt(hashedValue);

    // Compare the generated hash with the stored hash
    return generatedHash === storedHashedPassword;
  }

  compareWithHashedValue(hashedValue: HashedValue): boolean {
    const { hash } = this.detachSalt(hashedValue.hash);

    return hash === this.hash;
  }

  detachSalt(hashPassword: string) {
    if (hashPassword.includes(cryptoConfig.delimiter)) {
      const splittedData = hashPassword.split(cryptoConfig.delimiter);

      return {
        hash: splittedData[0]!,
        salt: splittedData[1]!,
      };
    }

    throw new BadRequestException(errorMessage.INVALID_HASH);
  }
}
