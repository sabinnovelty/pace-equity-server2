import { ICommonModel } from './interface';
import { isEmpty } from '../../shared/utils';
import { INestApplication } from '@nestjs/common';
import { MongoConnection } from './mongodb-connection';
import { ConfigService } from '../../shared/abstractions';

export async function registerMongoConnection(
  app: INestApplication<any>,
  models: ICommonModel<any>[] = []
) {
  const mongodbConnection = app.get(MongoConnection);
  const configService = app.get(ConfigService);

  const encryptedFieldsMap: Record<string, any> = {};
  models.forEach(model => {
    if (model.encryptedFieldsObj && !isEmpty(model.encryptedFieldsObj)) {
      encryptedFieldsMap[`${configService.mongoDb.dbName}.${model.modelName}`] =
        model.encryptedFieldsObj;
    }
  });
  await mongodbConnection.init(encryptedFieldsMap);
  await Promise.all(models.map(model => model.init()));
}
