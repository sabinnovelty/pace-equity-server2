import { Global, Module } from '@nestjs/common';
import { QEManager } from './encryptions/qe-manager';
import { MongoConnection } from './mongodb-connection';
import { CSFLEManager } from './encryptions/csfle-manager';
import { DbEncryptionManager } from './encryptions/db-encryption-manager';

@Global()
@Module({
  exports: [MongoConnection, CSFLEManager, DbEncryptionManager, QEManager],
  providers: [CSFLEManager, DbEncryptionManager, QEManager, MongoConnection],
})
export class MongoDbModule {}
