import { SYSTEM } from '../constants';
import { getCurrentUTCDate } from './date';
import { AdminAssigner, Assigner, ServiceOption } from '../types';

export function resolveAssigner(options: ServiceOption = {}): Assigner {
  const { authEntity } = options;

  const assigner: Assigner = { at: getCurrentUTCDate(), by: '' };

  if (!authEntity) {
    return assigner;
  }

  assigner.by = authEntity.name;
  if (authEntity.id) {
    assigner.id = authEntity.id;
  }

  return assigner;
}

export function resolveAdminAssigner(options: ServiceOption = {}): AdminAssigner {
  const { authEntity } = options;

  const assigner: AdminAssigner = {
    at: getCurrentUTCDate(),
    by: SYSTEM,
  };

  if (!authEntity) {
    return assigner;
  }

  assigner.by = authEntity.name;

  return assigner;
}
