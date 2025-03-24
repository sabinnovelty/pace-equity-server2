import { Injectable } from '@nestjs/common';
import { DbSession, UnitOfWork } from '../../shared/abstractions';

@Injectable()
export class PostgresUnitOfWorkImpl implements UnitOfWork {
  constructor() {}
  async execute<ReturnType>(
    callback: (session: DbSession) => Promise<ReturnType>
  ): Promise<ReturnType> {
    return await callback({});
  }
}
