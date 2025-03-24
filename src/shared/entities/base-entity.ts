import { Assigner } from '../types';
import { getUUID } from '../utils/common';

export class BaseEntity {
  id: number;
  created?: Assigner;
  updated?: Assigner;

  constructor(id?: number) {
    this.id = id ?? 0;
  }
}
