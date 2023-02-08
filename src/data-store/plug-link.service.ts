import { Injectable } from '@nestjs/common';
import { AbstractDynamicLinkService } from './abstract-dynamic-link.service';

@Injectable()
export class PlugLinkService extends AbstractDynamicLinkService {
  public async getHumanLink(absoluteUrl: string): Promise<string> {
    return absoluteUrl;
  }
}
