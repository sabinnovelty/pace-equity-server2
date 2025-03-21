import { dbMaxLengthValidations } from './validation-constant';

export const emailValidator = {
  bsonType: 'object',
  required: ['type', 'value'],
  properties: {
    type: {
      bsonType: 'string',
      enum: ['work', 'primary'],
      description: 'Type of email.',
      maxLength: dbMaxLengthValidations.GENERAL_STRING,
    },
    value: {
      bsonType: 'string',
      description: 'Email address.',
      maxLength: dbMaxLengthValidations.EMAIL,
    },
  },
};

export const emailListValidator = {
  bsonType: 'array',
  items: {
    ...emailValidator,
  },
  description: 'Array of email objects.',
};
