import { DateTime } from 'luxon';
import { DateUnit } from '../enum/date';

/**
 * Returns the current date and time in UTC.
 * @param includeTime A boolean indicating whether to include the current time or set it to 00:00.
 * @returns The current UTC date and time or UTC date with time set to 00:00.
 */
export function getCurrentUTCDate(includeTime: boolean = true): Date {
  const dateTime = DateTime.fromISO(new Date().toISOString());

  if (includeTime) {
    return dateTime.toUTC().toJSDate();
  } else {
    return dateTime.startOf('day').toUTC().toJSDate();
  }
}

/**
 * Adds a specified amount of time to a given date.
 * @param date The base date to which time will be added.
 * @param amount The amount of time to add.
 * @param unit The unit of time to add
 * @returns The new date with the added time.
 */
export function addDate(date: Date, amount: number, unit: DateUnit) {
  const dateTime = DateTime.fromJSDate(date);
  const modifiedDateTime = dateTime.plus({ [unit]: amount });

  return modifiedDateTime.toJSDate();
}

/**
 * Checks if a given date has passed the current time.
 * @param date The date to check for expiration.
 * @returns `true` if the date is expired, `false` otherwise.
 */
export function checkIfDateIsExpired(date: Date) {
  return DateTime.fromJSDate(date) < DateTime.fromJSDate(getCurrentUTCDate());
}

/**
 * Resets the time of a given date to midnight (00:00:00).
 * @param date The date to reset, either as a `Date` object or a string.
 * @returns The date string with time reset to midnight in ISO format.
 */
export function resetTimeToMidnight(date: string | Date): string {
  // Parse the input date using Luxon
  const luxonDateTime = DateTime.fromJSDate(date instanceof Date ? date : new Date(date), {
    zone: 'utc',
  });

  // Set the time to midnight
  const resultDateTime = luxonDateTime.set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  // Format the result as a string in the desired format
  const resultDateString = resultDateTime.toISO({ includeOffset: true });

  return resultDateString || ''; // Add a fallback for potential errors
}

export function getDateDifference(date1: Date, date2: Date, unit: DateUnit): number {
  const luxonDate1 = DateTime.fromJSDate(date1);
  const luxonDate2 = DateTime.fromJSDate(date2);

  return Math.round(luxonDate1.diff(luxonDate2, unit).as(unit));
}
