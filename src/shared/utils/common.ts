import { Environment } from '../enum';
import { randomUUID } from 'node:crypto';

/**
 * Pauses execution for a specified amount of time.
 * @param time
 */
export async function sleep(time: number) {
  return new Promise(res => {
    setTimeout(() => {
      res(true);
    }, time);
  });
}

/**
 * Generates a random OTP (One-Time Password) with the specified number of digits.
 * @param numberOfDigits
 * @returns OTP of type `string`
 */
export function generateOTP(numberOfDigits: number): string {
  const min = parseInt('1'.repeat(numberOfDigits));
  const max = parseInt('9'.repeat(numberOfDigits));

  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

/**
 * Generates a random UUID.
 * @returns UUID
 */
export const getUUID = () => randomUUID();

/**
 * Appends the environment suffix to a value if the environment is not production.
 * @param env
 * @param value
 * @returns value with the environment suffix if applicable
 */
export function attachEnv(env: string, value: string): string {
  return env != Environment.PROD ? `${value}_${env}` : value;
}

/**
 * Removes the environment suffix from a value if the environment is not production.
 * @param env
 * @param value
 * @returns value without the environment suffix if applicable
 */
export function detachEnv(env: string, value: string) {
  return env != Environment.PROD ? value.replace('_' + env, '') : value;
}

export function trimValue(value: string): string {
  return value.trim();
}
