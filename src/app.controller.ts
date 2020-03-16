import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async run(@Body() json: any): Promise<any> {
    return this.appService.runPipeline(json);
  }
}
