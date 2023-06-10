import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { UserEntity } from '../user';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'Pipeline' })
export class PipelineEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({
    type: 'text',
    nullable: false,
    default: '{}',
  })
  pipeline: string;
}
