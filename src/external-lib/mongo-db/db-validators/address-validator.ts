import { latLngValidations, dbMaxLengthValidations } from './validation-constant';

export const addressValidator = {
  bsonType: 'object',
  required: ['line1', 'city', 'state', 'zip'],
  properties: {
    line1: {
      bsonType: 'string',
      description: 'First line of the address.',
      maxLength: dbMaxLengthValidations.ADDRESS.LINE1,
    },
    line2: {
      bsonType: ['string', 'null'],
      description: 'Second line of the address.',
      maxLength: dbMaxLengthValidations.ADDRESS.LINE2,
    },
    city: {
      bsonType: 'string',
      description: 'City of the provider.',
      maxLength: dbMaxLengthValidations.ADDRESS.CITY,
    },
    state: {
      bsonType: 'string',
      description: 'State of the provider.',
      maxLength: dbMaxLengthValidations.ADDRESS.STATE,
    },
    zip: {
      bsonType: 'string',
      description: 'Zip code of the provider.',
      maxLength: dbMaxLengthValidations.ADDRESS.ZIP,
    },
    location: {
      bsonType: 'object',
      required: ['type', 'coordinates'],
      properties: {
        type: {
          bsonType: 'string',
          enum: ['Point'],
          description: "Must be 'Point' and is required.",
        },
        coordinates: {
          bsonType: 'array',
          description: 'An array containing longitude and latitude in [lng, lat] order.',
          minItems: 2,
          maxItems: 2,
          items: [
            {
              bsonType: ['double', 'int', 'long'],
              description: 'Longitude must be a number.',
              minimum: latLngValidations.lng.MIN,
              maximum: latLngValidations.lng.MAX,
            },
            {
              bsonType: ['double', 'int', 'long'],
              description: 'Latitude must be a number.',
              minimum: latLngValidations.lat.MIN,
              maximum: latLngValidations.lat.MAX,
            },
          ],
        },
      },
    },
  },
};
