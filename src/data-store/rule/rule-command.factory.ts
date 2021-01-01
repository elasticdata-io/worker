import AbstractDataRuleCommand from "./abstract-data-rule.command";
import OnlyNumberRuleCommand from "./command/only-number-rule.command";
import {Injectable} from "@nestjs/common";
import TrimRuleCommand from "./command/trim-rule.command";
import SplitRuleCommand from "./command/split-rule.command";
import ReplaceRuleCommand from "./command/replace-rule.command";
import ReplaceRegexRuleCommand from "./command/replace-regex-rule.command";
import DataRuleDto from "../dto/data-rule.dto";
import UniqueRuleCommand from "./command/unique-rule.command";
import JoinRuleCommand from "./command/join-rule.command";
import ExtractRegexRuleCommand from "./command/extract-regex-rule.command";

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
            default:
                throw new Error(`not supported data rule: ${config.cmd}`)
        }
    }
}
