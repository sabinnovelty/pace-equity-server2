import { ICommonModel } from './interface';
import { INestApplication } from '@nestjs/common';
import { UserModel } from '../../app/user/repository/models/user-model';

export const getMongoModelsForRegistration = (app: INestApplication<any>): ICommonModel<any>[] => {
  const userModel = app.get(UserModel);

  return [userModel];
};
