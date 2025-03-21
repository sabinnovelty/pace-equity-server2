import { Maybe } from '../types';
import { ZodError, ZodIssue } from 'zod';
import { MongoServerError } from 'mongodb';

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

export const formatMongoDispalyError = (exception: MongoServerError): string => {
  if (exception.code === 121) {
    return parseMongoValidationError(exception);
  } else if (exception.code === 11000) {
    const key = Object.keys(exception.keyPattern || {})[0];
    const value = exception.keyValue ? exception.keyValue[key!] : 'Unknown';

    return `Duplicate key error: The field '${key}' with value '${value}' already exists.`;
  }

  return exception.message;
};

export const parseMongoValidationError = (error: any): string => {
  try {
    if (error.errInfo && error.errInfo.details && error.errInfo.details.schemaRulesNotSatisfied) {
      return extractNestedValidationErrors(error.errInfo.details.schemaRulesNotSatisfied);
    }

    return 'Document validation failed. Ensure all fields meet the required schema constraints.';
  } catch (e) {
    return 'An unknown validation error occurred.';
  }
};

const extractNestedValidationErrors = (rules: any[]): string => {
  try {
    const errors: string[] = [];

    for (const rule of rules) {
      if (rule.operatorName === 'required' && rule.missingProperties) {
        errors.push(`Missing required fields: ${rule.missingProperties.join(', ')}`);
      }

      if (rule.operatorName === 'properties' && rule.propertiesNotSatisfied) {
        for (const property of rule.propertiesNotSatisfied) {
          if (property.details) {
            for (const detail of property.details) {
              if (detail.operatorName === 'items' && detail.details) {
                // Handling array validation errors
                for (const itemDetail of detail.details) {
                  if (
                    itemDetail.operatorName === 'properties' &&
                    itemDetail.propertiesNotSatisfied
                  ) {
                    for (const subProperty of itemDetail.propertiesNotSatisfied) {
                      if (subProperty.details) {
                        for (const deepDetail of subProperty.details) {
                          if (deepDetail.operatorName === 'enum') {
                            errors.push(
                              `Field: '${subProperty.propertyName}', Value: '${deepDetail.consideredValue}', Error: '${deepDetail.reason}', Allowed Values: ${JSON.stringify(deepDetail.specifiedAs.enum)}`
                            );
                          } else {
                            errors.push(
                              `Field: '${subProperty.propertyName}', Error: '${subProperty.description}'`
                            );
                          }
                        }
                      }
                    }
                  }
                }
              } else if (detail.operatorName === 'enum') {
                errors.push(
                  `Field '${property.propertyName}' has an invalid value: '${detail.consideredValue}'. Expected values: ${detail.specifiedAs.enum.join(', ')}`
                );
              } else if (['minLength', 'maxLength'].includes(detail.operatorName)) {
                errors.push(
                  `Field '${property.propertyName}' violates length constraint: ${detail.operatorName} = ${detail.specifiedAs[detail.operatorName]}`
                );
              } else if (['minimum', 'maximum'].includes(detail.operatorName)) {
                errors.push(
                  `Field '${property.propertyName}' must be between ${detail.specifiedAs.minimum} and ${detail.specifiedAs.maximum}, but got '${detail.consideredValue}'`
                );
              } else if (detail.operatorName === 'pattern') {
                errors.push(
                  `Field '${property.propertyName}' does not match required pattern: ${detail.specifiedAs.pattern}`
                );
              } else if (detail.operatorName === 'uniqueItems') {
                errors.push(
                  `Array field '${property.propertyName}' contains duplicate values but must be unique.`
                );
              } else if (detail.operatorName === 'additionalProperties') {
                errors.push(
                  `Unexpected field '${property.propertyName}' found, but additional properties are not allowed.`
                );
              } else if (detail.operatorName === 'dependencies') {
                errors.push(
                  `Field '${property.propertyName}' requires the presence of '${detail.specifiedAs.dependencies.join(', ')}' but they are missing.`
                );
              } else {
                errors.push(`Field: '${property.propertyName}', Error: '${detail.reason}'`);
              }
            }
          }
        }
      }
    }

    if (errors.length)
      return 'Validation failed due to the following errors: ' + errors.join(' | ');

    return DEFAULT_MONGO_VALIDATION_MESSAGE;
  } catch (e) {
    return DEFAULT_MONGO_VALIDATION_MESSAGE;
  }
};
