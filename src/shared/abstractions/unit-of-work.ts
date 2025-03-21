export abstract class UnitOfWork {
  abstract execute<ReturnType>(
    callback: (session: DbSession) => Promise<ReturnType>
  ): Promise<ReturnType>;
}

export type DbSession = any;
