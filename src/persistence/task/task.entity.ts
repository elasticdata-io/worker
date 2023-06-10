import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { PipelineEntity } from '../pipeline';
import { UserEntity } from '../user';
import { BaseEntity } from '../base.entity';

export type TaskStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'error'
  | 'stopped';

@Entity({ name: 'Task' })
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PipelineEntity)
  @JoinColumn()
  parent: PipelineEntity;

  @Column({
    type: 'text',
    nullable: false,
    default: '{}',
  })
  pipeline: string;

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

  @Column({
    default: 'pending',
    nullable: false,
  })
  status: TaskStatus;

  @Column({ nullable: true })
  failReason?: string;

  @Column({ type: 'timestamptz', nullable: true })
  startedOn?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finishedOn?: Date;
}
