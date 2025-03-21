import { ClientSession } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { MongoConnection } from './mongodb-connection';
import { Logger, UnitOfWork } from '../../shared/abstractions';

@Injectable()
export class MongoDbUnitOfWorkImpl implements UnitOfWork {
  constructor(
    private mongodbConnection: MongoConnection,
    private logger: Logger
  ) {}
  /**
   * The function `createAndCommitTransaction` creates a MongoDB session, starts a transaction, executes
   * a callback function with the session, commits the transaction if successful, and ends the session.
   * @param callback - The `callback` parameter is a function that takes a `ClientSession` as an argument
   * and returns a value. This function is responsible for performing the desired operations within the
   * transaction.
   * @param clientSessionOption - Optional settings for the client session.
   * @returns The result of the callback function is being returned.
   * @throws An error if the transaction is aborted or fails.
   */

  execute = async (callback: (session: ClientSession) => any): Promise<any> => {
    if (this.mongodbConnection?.mongoClient) {
      const session = this.mongodbConnection.mongoClient.startSession();
      session.startTransaction();
      try {
        const result = await callback(session);

        await this.commitWithRetry(session);

        return result;
      } catch (error: any) {
        this.logger.debug('MongoDB transaction aborted! Caught exception during transaction.');

        // If transient error, retry the whole transaction
        if (error.errorLabels && error.errorLabels.indexOf('TransientTransactionError') >= 0) {
          this.logger.debug('Retrying MongoDB transaction due to TransientTransactionError...');

          return await this.execute(callback);
        } else {
          await session.abortTransaction();
          throw error;
        }
      } finally {
        await session.endSession();
      }
    }
  };

  private commitWithRetry = async (session: ClientSession) => {
    try {
      await session.commitTransaction();
      this.logger.debug('MongoDB transaction committed!');
    } catch (error: any) {
      if (error.errorLabels && error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0) {
        this.logger.debug(
          'Retrying MongoDB commit operation due to UnknownTransactionCommitResult...'
        );
        await this.commitWithRetry(session);
      } else {
        throw error;
      }
    }
  };
}
