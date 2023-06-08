import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UsersModule } from './user';
import { PipelineEntity } from './pipeline';
import { TaskEntity, TasksModule } from './task';
import { BucketEntity, BucketModule } from './bucket';
import { FileEntity, FileModule } from './file';

@Module({
  imports: [
    UsersModule,
    TasksModule,
    BucketModule,
    FileModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5454,
      username: 'dev',
      password: 'dev',
      database: 'dev',
      entities: [
        PipelineEntity,
        TaskEntity,
        UserEntity,
        BucketEntity,
        FileEntity,
      ],
      synchronize: true,
    }),
  ],
})
export class OrmModule {}
