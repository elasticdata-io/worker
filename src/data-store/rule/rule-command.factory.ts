import AbstractDataRuleCommand from './abstract-data-rule.command';
import { Injectable } from '@nestjs/common';
import DataRuleDto from '../dto/data-rule.dto';
import {
  ExtractRegexRuleCommand,
  JoinRuleCommand,
  OnlyNumberRuleCommand,
  ReplaceRegexRuleCommand,
  ReplaceRuleCommand,
  SplitRuleCommand,
  TrimRuleCommand,
  UniqueRuleCommand,
  PluckRuleCommand,
} from './command';

@Injectable()
export default class RuleCommandFactory {
  create(config: DataRuleDto): AbstractDataRuleCommand {
    switch (config.cmd) {
      case 'only_number':
        return new OnlyNumberRuleCommand(config);
      case 'trim':
        return new TrimRuleCommand(config);
      case 'split':
        return new SplitRuleCommand(config);
      case 'replace':
        return new ReplaceRuleCommand(config);
      case 'replace_regex':
        return new ReplaceRegexRuleCommand(config);
      case 'unique':
        return new UniqueRuleCommand(config);
      case 'join':
        return new JoinRuleCommand(config);
      case 'extract_regex':
        return new ExtractRegexRuleCommand(config);
      case 'pluck':
        return new PluckRuleCommand(config);
      default:
        throw new Error(`not supported data rule: ${config.cmd}`);
    }
  }
}
