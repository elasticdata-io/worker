import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { BucketEntity } from '../bucket';

@Entity({ name: 'File' })
export class FileEntity {
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
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  headers: Record<string, unknown>;
}
