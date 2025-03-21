import { Assigner } from '../types';
import { getUUID } from '../utils/common';

export class BaseEntity {
  id: string;
  created?: Assigner;
  updated?: Assigner;

  constructor(id?: string) {
    this.id = id ?? getUUID();
  }
}
