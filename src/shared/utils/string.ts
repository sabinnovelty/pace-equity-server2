import { randomBytes } from 'crypto';
import { camelCase, snakeCase } from 'lodash';
import { DomainException } from '../exception';

/**
 * Replaces dynamic variables in a string with corresponding values from a provided object.
 * @param input The input string containing dynamic variables.
 * @param variables The object containing variable values.
 * @param emptyValuePlaceholder Placeholder for variables with undefined values.
 * @returns The processed string with dynamic variables replaced.
 */
export function replaceDynamicVariables(
  input: string,
  variables: Record<string, any>,
  emptyValuePlaceholder?: string
): string {
  const regex = /\{\{([\w.]+)\}\}/g;

  return input.replace(regex, (match, variable) => {
    const value = variable
      .split('.')
      .reduce((obj: Record<string, any>, key: string) => obj?.[key], variables);

    return value !== undefined ? value : emptyValuePlaceholder ?? match;
  });
}

/**
 * Joins multiple strings using a specified delimiter.
 * @param delimiter The delimiter to join the strings.
 * @param words The strings to join.
 * @returns The joined string.
 */
export function joinStrings(delimiter: string, ...words: string[]): string {
  return words.join(delimiter);
}

/**
 * Formats a module message by replacing dynamic variables with the module name.
 * @param message The message template.
 * @param moduleName The module name to insert.
 * @returns
 */
export function formatModuleMessage(message: string, moduleName: string) {
  return replaceDynamicVariables(message, { module: moduleName });
}

/**
 * Converts a string to title case.
 * @param string The string to convert.
 * @returns The converted string in title case.
 */
export const toTitleCase = (string: string) =>
  string.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

/**
 * Converts a string to kebab case.
 * @param value The string to convert.
 * @param screaming Whether to convert to screaming kebab case (uppercase).
 * @returns The converted string in kebab case.
 */
export function toKebabCase(value: string, screaming = false): string {
  return (screaming ? value.toUpperCase() : value.toLocaleLowerCase()).split(' ').join('-');
}

/**
 * Converts a string to camel case.
 * @param value The string to convert.
 * @returns The converted string in camel case.
 */
export function toCamelCase(value: string): string {
  return camelCase(value);
}

/**
 * Converts a string to Pascal case.
 * @param value The string to convert.
 * @returns The converted string in Pascal case.
 */
export function toPascalCase(value: string): string {
  const camelCaseStr = camelCase(value);

  return camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1);
}

/**
 * Converts a string to snake case.
 * @param value The string to convert.
 * @param screaming Whether to convert to screaming snake case (uppercase).
 * @returns The converted string in snake case.
 */
export function toSnakeCase(value: string, screaming = false): string {
  const snakeCaseStr = snakeCase(value);

  return screaming ? snakeCaseStr.toLocaleUpperCase() : snakeCaseStr.toLocaleLowerCase();
}

/**
 * Parses a string to escape special characters.
 * @param value The string to parse.
 * @returns The parsed string with escaped special characters.
 */
export function parseSpecialCharacterString(value: string) {
  return value
    .split('')
    .map(str => {
      if (str.match(/[\\[\\\]\\*\\+\\?\\(\\)]/g)) return '\\' + str;

      return str;
    })
    .join('');
}

/**
 * Capitalizes the first letter of each word in a string.
 * @param str The string to modify.
 * @returns The modified string with each word's first letter capitalized.
 */
export function capitalizeFirstLetterOfEachWord(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Generates the full name of a person by concatenating their first name,
 * middle name (if provided), and last name with a space delimiter.
 *
 * @param {Object} values  An object containing name details.
 * @param {string} values.firstName  The first name of the person.
 * @param {string} [values.middleName]  The middle name of the person (optional).
 * @param {string} values.lastName  The last name of the person.
 * @returns {string} The full name, including the middle name if provided.
 */
export function getFullName(values: {
  firstName: string;
  middleName?: string;
  lastName: string;
}): string {
  const { firstName, middleName, lastName } = values;
  if (middleName) return joinStrings(' ', firstName, middleName, lastName);

  return joinStrings(' ', firstName, lastName);
}

/**
 * Generates a strong random key of the specified length.
 * @param length - Lenth of the key
 * @returns {string} - Generated random key
 */
export function generateRandomKey(length: number): string {
  if (length <= 0) {
    throw new DomainException('Length of the key must be greater than 0');
  }
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Alphanumeric characters
  const charactersLength = characters.length;

  let key = '';
  const randomBytesValue = randomBytes(length);

  for (let i = 0; i < length; i++) {
    // Use randomBytes to get a random index for each character
    const randomIndex = (randomBytesValue[i] ?? 0) % charactersLength;
    key += characters[randomIndex];
  }

  return key;
}

export function generateRandomSecret(length: number): string {
  // Ensure the length is even
  const byteLength = Math.ceil(length / 2);

  return randomBytes(byteLength).toString('hex').slice(0, length);
}
