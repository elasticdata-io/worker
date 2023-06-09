import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { PipelineEntity } from '../pipeline';
import { UserEntity } from '../user';

@Entity({ name: 'Task' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PipelineEntity)
  @JoinColumn()
  pipeline: PipelineEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({
    type: process.env.PSQL_DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  data: Array<Record<string, unknown>>;
}
