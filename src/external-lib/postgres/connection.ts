import path from 'path';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '../../shared/abstractions';

export class PostgresConnection {
  private dataSource: DataSource;
  constructor(private configService: ConfigService) {}

  async connect() {
    const config = this.configService.postgres;
    const dataSourceOptions: DataSourceOptions = {
      type: 'postgres',
      host: config.host,
      port: Number(config.port),
      username: config.username,
      password: config.password,
      database: config.dbName,
      // Don't use this in production. Always keep false
      synchronize: false,
      logging: false,
      //   entities: ['src/entity/*.{ts,js}'],
      entities: [path.join(__dirname, '**/*-schema.ts')], // Use the correct path

      // migrations: ['src/migration/*.{ts,js}'],
      subscribers: [],
    };

    this.dataSource = new DataSource(dataSourceOptions);
    await this.dataSource.initialize();
    console.log('******* Database connected successfully *******');

    return this.dataSource;
  }

  async disconnect() {
    await this.dataSource.destroy();
  }
}
