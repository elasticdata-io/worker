import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async run(@Body() json: any, @Headers('useruuid') userUuid: string): Promise<string> {
    return this.appService.runPipeline(json, userUuid);
  }
}
