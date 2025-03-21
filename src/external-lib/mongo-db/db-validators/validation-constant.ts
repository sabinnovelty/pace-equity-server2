export const dbMaxLengthValidations = {
  GENERAL_STRING: 200,
  GENERAL_LONG_STRING: 2000,
  EMAIL: 100,
  PHONE: 20,
  UUID: 40,
  NPI: 10,
  TAXONOMY_CODE: 10,
  PROVIDER_ID: 10,
  ADDRESS: {
    LINE1: 200,
    LINE2: 200,
    CITY: 200,
    STATE: 50,
    ZIP: 10,
  },
};

export const latLngValidations = {
  lat: {
    MIN: -90,
    MAX: 90,
  },
  lng: {
    MIN: -180,
    MAX: 180,
  },
};
