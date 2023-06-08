import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { UserEntity } from '../user';

@Entity({ name: 'Pipeline' })
export class PipelineEntity {
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
