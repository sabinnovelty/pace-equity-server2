import { Maybe } from '../types';
import { ZodError, ZodIssue } from 'zod';

const DEFAULT_MONGO_VALIDATION_MESSAGE =
  'Document validation failed. Ensure all fields meet the required schema constraints.';

const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue;
  const pathString = path.join('.');

  return `${pathString}: ${message}`;
};

export const formatZodDislpayError = (error: ZodError): Maybe<string> => {
  const { issues } = error;

  if (issues.length) {
    return formatZodIssue(issues[0]!);
  }
};
