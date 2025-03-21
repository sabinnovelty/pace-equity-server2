import { dbMaxLengthValidations } from './validation-constant';

export const assignerValidator = {
  bsonType: 'object',
  required: ['by', 'at'],
  properties: {
    by: {
      bsonType: 'string',
      maxLength: dbMaxLengthValidations.GENERAL_STRING,
      description: 'must be a string and is required',
    },
    id: {
      bsonType: ['string', 'null'],
      maxLength: dbMaxLengthValidations.GENERAL_STRING,
      description: 'must be a string',
    },
    at: {
      bsonType: 'date',
      description: 'must be a date and is required',
    },
  },
};
