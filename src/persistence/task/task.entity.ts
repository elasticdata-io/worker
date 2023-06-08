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
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  data: Array<Record<string, unknown>>;
}
