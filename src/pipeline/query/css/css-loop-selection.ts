import { AbstractLoopSelection } from '../abstract-loop-selection';
import { AbstractCommand } from '../../command/abstract-command';
import { DataContextResolver } from '../../data/data-context-resolver';
import { injectable } from 'inversify';

@injectable()
export class CssLoopSelection extends AbstractLoopSelection {
  protected getSingleSelector(selector: string) {
    return `document.querySelector(\`${selector}\`)`;
  }

  protected getMultipleSelector(selector: string, document = 'document') {
    return `${document}.querySelectorAll(\`${selector}\`)`;
  }

  public querySelectorAll(
    command: AbstractCommand,
    resolver: DataContextResolver,
  ): string {
    const selectors = this._getSelectorsWithIndex(command, resolver);
    if (selectors.length === 1) {
      const selector = selectors.pop().toString();
      return this.getMultipleSelector(selector);
    }
    const jsSelector = this._toJsSelector(selectors);
    const isSingle = jsSelector[jsSelector.length - 1] === ']';
    if (isSingle) {
      return `Array.of(${jsSelector})`;
    }
    return jsSelector;
  }

  public querySelector(
    command: AbstractCommand,
    resolver: DataContextResolver,
  ): string {
    const selectors = this._getSelectorsWithIndex(command, resolver);
    if (selectors.length === 1) {
      const selector = selectors.pop().toString();
      return this.getSingleSelector(selector);
    }
    const jsSelector = this._toJsSelector(selectors);
    const isMultiple = jsSelector[jsSelector.length - 1] === ')';
    if (isMultiple) {
      return `${jsSelector}[0]`;
    }
    return jsSelector;
  }

  protected _toJsSelector(selectors: any[]): string {
    return selectors
      .filter((x) => x !== undefined && x !== null && x !== '')
      .reduce((accumulator, currentValue, index) => {
        accumulator =
          index === 1 ? this.getMultipleSelector(accumulator) : accumulator;
        currentValue = currentValue.toString().trim();
        if (isFinite(currentValue)) {
          return `${accumulator}[${currentValue}]`;
        }
        return this.getMultipleSelector(currentValue, accumulator);
      });
  }
}
