import {
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'Bucket' })
export class BucketEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
