import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AliveService } from './alive.service';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		ConfigModule.forRoot(),
	],
	providers: [AliveService,]
})
export class AliveModule {}