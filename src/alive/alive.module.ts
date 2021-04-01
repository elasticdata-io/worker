import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AliveService } from './alive.service';
import { EnvModule } from '../env/env.module';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		ConfigModule.forRoot(),
		EnvModule,
	],
	providers: [AliveService,]
})
export class AliveModule {}