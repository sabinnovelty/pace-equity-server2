import { AuthEntity } from './auth';
import { ProjectModule } from '../enum';
import { DbSession } from '../abstractions/unit-of-work';

export type ServiceOption = {
  authEntity?: AuthEntity;
  session?: DbSession;
  sourceModule?: ProjectModule;
};
