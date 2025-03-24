import { Assigner } from '../types';

export class BaseEntity {
  id: number;
  created?: Assigner;
  updated?: Assigner;

  constructor(id?: number) {
    this.id = id ?? 0;
  }
}
