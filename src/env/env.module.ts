import { Module } from '@nestjs/common';
import { EnvConfiguration } from './env.configuration';
import { EnvConfigurationService } from './env.configuration.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: EnvConfiguration,
      useClass: EnvConfigurationService,
    },
  ],
  exports: [EnvConfiguration],
})
export class EnvModule {}
