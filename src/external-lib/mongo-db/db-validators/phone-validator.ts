import { dbMaxLengthValidations } from './validation-constant';

export const phoneValueValidator = {
  bsonType: 'object',
  required: ['value'],
  properties: {
    value: {
      bsonType: 'string',
      description: 'Phone number.',
      maxLength: dbMaxLengthValidations.PHONE,
    },
    countryCode: {
      bsonType: ['string', 'null'],
      description: 'Extension of the phone number.',
      maxLength: dbMaxLengthValidations.PHONE,
    },
    countryISO: {
      bsonType: ['string', 'null'],
      description: 'Country code of the phone number.',
      maxLength: dbMaxLengthValidations.PHONE,
    },
  },
};

export const phoneValidator = {
  bsonType: 'object',
  required: ['type', 'value'],
  properties: {
    type: {
      bsonType: 'string',
      enum: ['cell', 'home', 'work'],
      description: 'Type of phone.',
      maxLength: dbMaxLengthValidations.PHONE,
    },
    value: {
      bsonType: 'string',
      description: 'Phone number.',
      maxLength: dbMaxLengthValidations.PHONE,
    },
    countryCode: {
      bsonType: ['string', 'null'],
      description: 'Country code of the phone number.',
      maxLength: dbMaxLengthValidations.PHONE,
    },
    countryISO: {
      bsonType: ['string', 'null'],
      description: 'Country ISO code of the phone number.',
      maxLength: dbMaxLengthValidations.PHONE,
    },
  },
};

export const phoneListValidator = {
  bsonType: 'array',
  items: {
    ...phoneValidator,
  },
  description: 'Array of phone objects.',
};
