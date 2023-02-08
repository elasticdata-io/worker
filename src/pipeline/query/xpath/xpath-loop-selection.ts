import { AbstractLoopSelection } from '../abstract-loop-selection';
import { injectable } from 'inversify';
import { AbstractCommand } from '../../command/abstract-command';
import { DataContextResolver } from '../../data/data-context-resolver';
import { LoopElement } from '../loop.element';
import { StringGenerator } from '../../util/string.generator';

@injectable()
export class XpathLoopSelection extends AbstractLoopSelection {
  private _getLoopElements(
    command: AbstractCommand,
    resolver: DataContextResolver,
  ): LoopElement[] {
    const selectorsWithIndex = this._getSelectorsWithIndex(command, resolver);
    const selectors: LoopElement[] = [];
    while (true) {
      if (selectorsWithIndex.length === 0) {
        break;
      }
      const selector = selectorsWithIndex.shift();
      const withoutLoopIndex = selectorsWithIndex.length === 0;
      const loopIndex = withoutLoopIndex
        ? Number.NaN
        : parseInt(selectorsWithIndex.shift().toString(), 10);
      const uuid = `uuid${StringGenerator.generate()}`;
      const docRef =
        selectors.length === 0
          ? 'document'
          : selectors[selectors.length - 1].variableName;
      const jsExpression = withoutLoopIndex
        ? `var ${uuid} = document.evaluate(\`${selector}\`, ${docRef}, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);\n` +
          `let results${uuid} = [];\n` +
          `for (let i = 0, length = ${uuid}.snapshotLength; i < length; ++i) {\n` +
          `    results${uuid}.push(${uuid}.snapshotItem(i));\n` +
          `}\n` +
          `${uuid} = results${uuid};`
        : `var ${uuid} = document.evaluate(\`${selector}\`, ${docRef}, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(${loopIndex});`;
      selectors.push({
        selector: selector,
        loopIndex: loopIndex,
        variableName: uuid,
        jsExpression: jsExpression,
      } as LoopElement);
    }
    return selectors;
  }

  private _getJsExpressionForAll(loopElements: LoopElement[]) {
    let jsExpression = '';
    while (true) {
      const loopElement = loopElements.shift();
      jsExpression += `${loopElement.jsExpression}\n`;
      if (loopElements.length === 0) {
        const hasLoopIndex = isNaN(loopElement.loopIndex) == false;
        jsExpression += hasLoopIndex
          ? `return Array.of(${loopElement.variableName})`
          : `return ${loopElement.variableName}`;
        break;
      }
    }
    return jsExpression;
  }

  private _getJsExpression(loopElements: LoopElement[]) {
    let jsExpression = '';
    while (true) {
      const loopElement = loopElements.shift();
      jsExpression += `${loopElement.jsExpression}\n`;
      if (loopElements.length === 0) {
        const hasLoopIndex = isNaN(loopElement.loopIndex) == false;
        jsExpression += hasLoopIndex
          ? `return ${loopElement.variableName}`
          : `return ${loopElement.variableName}[0]`;
        break;
      }
    }
    return jsExpression;
  }

  public querySelectorAll(
    command: AbstractCommand,
    resolver: DataContextResolver,
  ): string {
    const loopElements = this._getLoopElements(command, resolver);
    return this._getJsExpressionForAll(loopElements);
  }

  public querySelector(
    command: AbstractCommand,
    resolver: DataContextResolver,
  ): string {
    const loopElements = this._getLoopElements(command, resolver);
    return this._getJsExpression(loopElements);
  }
}
