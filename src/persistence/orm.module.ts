import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserPersistenceModule } from './user';
import { PipelineEntity } from './pipeline';
import { TaskEntity, TaskPersistenceModule } from './task';
import { BucketEntity, BucketPersistenceModule } from './bucket';
import { FileEntity, FilePersistenceModule } from './file';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { DataSourceOptions } from 'typeorm';

const getDbConfig = (): TypeOrmModuleOptions => {
  const dbType: 'postgres' | 'sqlite' = process.env.PSQL_DB_TYPE as
    | 'postgres'
    | 'sqlite';
  const config: DataSourceOptions = {
    type: dbType,
    port: parseInt(process.env.PSQL_DB_PORT, 10),
    username: process.env.PSQL_DB_USER,
    password: process.env.PSQL_DB_PASSWORD,
    database: process.env.PSQL_DB_NAME,
    entities: [
      PipelineEntity,
      TaskEntity,
      UserEntity,
      BucketEntity,
      FileEntity,
    ],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  };
  if (dbType === 'postgres') {
    Object.assign(config, {
      host: process.env.PSQL_DB_HOST,
    });
  }
  return config;
};

@Module({
  imports: [
    UserPersistenceModule,
    TaskPersistenceModule,
    BucketPersistenceModule,
    FilePersistenceModule,
    TypeOrmModule.forRoot(getDbConfig()),
  ],
})
export class OrmPersistenceModule {}
