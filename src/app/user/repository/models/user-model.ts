import { Injectable } from '@nestjs/common';
import { UserSchema } from '../schemas/user-schema';
import { BaseModel, MongoConnection } from '../../../../external-lib/mongo-db';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';

@Injectable()
export class UserModel extends BaseModel<UserSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.USER, {
      useSoftDelete: true,
      isolateOrganization: true,
      uniqueIdentifierField: 'userId',
      searchableFields: [
        'demographic.name.firstName',
        'demographic.name.lastName',
        'demographic.name.middleName',
        'email',
      ],
      filterableFields: [
        'email',
        'status',
        'demographic.name.firstName',
        'demographic.name.lastName',
      ],
    });
  }
}
