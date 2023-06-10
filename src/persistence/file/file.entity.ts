import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { BucketEntity } from '../bucket';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'File' })
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BucketEntity)
  @JoinColumn()
  bucket: BucketEntity;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column({
    type: process.env.PSQL_DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  headers: Record<string, unknown>;
}
