import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseSchema {
  @PrimaryGeneratedColumn()
  id: number;
}
