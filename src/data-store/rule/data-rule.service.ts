import { Injectable } from '@nestjs/common';
import AbstractDataRuleCommand from './abstract-data-rule.command';
import RuleCommandFactory from './rule-command.factory';
import DataRuleDto from '../dto/data-rule.dto';

@Injectable()
export class DataRuleService {
  constructor(private _ruleCommandFactory: RuleCommandFactory) {}

  public getDataRules(
    rulesConfig: Array<DataRuleDto>,
  ): AbstractDataRuleCommand[] {
    return rulesConfig.map((config) => {
      return this._ruleCommandFactory.create(config);
    });
  }
}
