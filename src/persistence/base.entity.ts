import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  modifiedOn?: Date;

  @VersionColumn()
  version: number;
}
