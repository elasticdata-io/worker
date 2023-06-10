import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserPersistenceService } from './user-persistence.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserPersistenceService],
})
export class UserPersistenceModule {}
