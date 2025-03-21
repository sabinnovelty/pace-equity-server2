import { Injectable } from '@nestjs/common';
import { errorMessage } from '../../shared/constants';
import { BadRequestException } from '../../shared/exception';
import { cryptoConfig } from '../../shared/constants/crypto-config';
import { ConfigService, CryptoHelper } from '../../shared/abstractions';
import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from 'crypto';

@Injectable()
export class CryptoHelperImpl implements CryptoHelper {
  constructor(private configService: ConfigService) {}

  /**
   * The function takes a password as input, generates a random salt, and then uses the pbkdf2Sync
   * function to generate a hash of the password using the salt.
   * @param {string} password - The `password` parameter is a string that represents the password that
   * needs to be hashed.
   * @returns the hash of the password, which is a string.
   */
  hash(password: string): string {
    const salt = randomBytes(16); // Generate a random salt

    // Generate the hash synchronously
    const hash = pbkdf2Sync(
      password,
      salt,
      cryptoConfig.hashIterations,
      cryptoConfig.hashKeylen,
      cryptoConfig.hashDigest
    );

    return this.attachSalt(hash, salt);
  }

  /**
   * The function compares a user-provided password with a stored hashed password to determine if they
   * match.
   * @param {string} userPassword - The user-provided password that needs to be compared with the stored
   * hashed password.
   * @param {string} hashPassword - The `hashPassword` parameter is the stored password hash. It contains
   * both the hashed password and the salt used for hashing.
   * @returns a boolean value.
   */
  compare(userPassword: string, hashPassword: string): boolean {
    const { salt: storedSalt, hash: storedHashedPassword } = this.detachSalt(hashPassword);

    // Hash the user-provided password with the stored salt and parameters
    const hash = pbkdf2Sync(
      userPassword,
      Buffer.from(storedSalt, 'hex'),
      cryptoConfig.hashIterations,
      cryptoConfig.hashKeylen,
      cryptoConfig.hashDigest
    );

    // Compare the generated hash with the stored hash
    return hash.toString('hex') === storedHashedPassword;
  }

  private attachSalt(hash: Buffer, salt: Buffer) {
    return hash.toString('hex') + cryptoConfig.delimiter + salt.toString('hex');
  }

  private detachSalt(hashPassword: string) {
    if (hashPassword.includes(cryptoConfig.delimiter)) {
      const splittedData = hashPassword.split(cryptoConfig.delimiter);

      return {
        hash: splittedData[0]!,
        salt: splittedData[1]!,
      };
    }

    throw new BadRequestException(errorMessage.INVALID_HASH);
  }

  /**
   * Encrypts a given value using AES encryption with a provided secret key and algorithm.
   *
   * @param value - The data to be encrypted. Can be any serializable value.
   * @param key - The encryption key as a hexadecimal string (32 bytes for AES-256).
   * @param algorithm - The encryption algorithm to use (default: 'aes-256-cbc').
   *
   * @returns The encrypted data as a hex string, formatted as `IV:CipherText`.
   *
   */
  encrypt(value: any, key: string, algorithm = cryptoConfig.defaultEncryptionAlgorithm): string {
    const iv = randomBytes(16);

    // Create a cipher with the 'createCipheriv' method
    const cipher = createCipheriv(algorithm, Buffer.from(key.toString().slice(0, 32)), iv);

    // Update the cipher with the plaintext and obtain the encrypted data
    let encryptedData = cipher.update(JSON.stringify(value), 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    // Output the encrypted data
    return `${iv.toString('hex')}${cryptoConfig.delimiter}${encryptedData}`;
  }

  /**
   * Decrypts an encrypted value using AES decryption with a provided secret key and algorithm.
   *
   *
   * @param value - The encrypted string in the format `IV:CipherText`.
   * @param key - The decryption key as a hexadecimal string (must match the encryption key).
   * @param algorithm - The encryption algorithm used (default: 'aes-256-cbc').
   *
   * @returns The decrypted value, parsed into its original type.
   *
   */
  decrypt<Decrypted>(value: string, key: string, algorithm = 'aes-256-cbc'): Decrypted {
    const [ivHex, encryptedData] = value.split(cryptoConfig.delimiter);

    if (!ivHex || !encryptedData) {
      throw new Error('Invalid encrypted value format. Expected format: IV:CipherText');
    }

    const iv = Buffer.from(ivHex, 'hex');

    const decipher = createDecipheriv(algorithm, Buffer.from(key.toString().slice(0, 32)), iv);

    // Update the decipher with the encrypted data to obtain the original plaintext
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return JSON.parse(decryptedData);
  }
}
