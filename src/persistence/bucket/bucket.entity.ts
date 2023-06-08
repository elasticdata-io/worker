import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Bucket' })
export class BucketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
