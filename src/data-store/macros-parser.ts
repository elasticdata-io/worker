import { LoopMacros, Macros, TaskDataStoreContext } from './models';
import { LineMacros } from './models';
import { SystemError } from '../pipeline/command/exception/system-error';

const LINE_MACROS_PATTERN = /\{\$line\.([^}.]+)\}/i;
const LOOP_INDEX_PATTERN = /\[__loop(=('|")([^0-9'"]*)('|"))?\]/i;
const OLD_LOOP_INDEX_PATTERN = /\{\$i(:([^}]+))?\}/i;

function parseLineMacros(input: string): LineMacros {
  if (input.search(LINE_MACROS_PATTERN) !== -1) {
    const match = input.match(LINE_MACROS_PATTERN);
    const lineMacros: LineMacros = {
      type: 'line',
      key: match[1],
      macros: match[0],
    };
    return lineMacros;
  }
}

function parseLoopMacros(input: string): LoopMacros {
  if (input.search(LOOP_INDEX_PATTERN) !== -1) {
    const match = input.match(LOOP_INDEX_PATTERN);
    const loopMacros: LoopMacros = {
      type: 'loop',
      context: match[3] || undefined,
      macros: match[0],
    };
    return loopMacros;
  }
}

function parseOldLoopMacros(input: string): LoopMacros {
  if (input.search(OLD_LOOP_INDEX_PATTERN) !== -1) {
    const match = input.match(OLD_LOOP_INDEX_PATTERN);
    const loopMacros: LoopMacros = {
      type: 'loop',
      context: match[2] || undefined,
      macros: match[0],
    };
    return loopMacros;
  }
}

function resolveLoopIndex(
  commandContext: string,
  loopContext: string | undefined,
): number {
  if (!loopContext) {
    return parseInt(commandContext.split(`.`).pop(), 10) || 0;
  }
  const contexts = commandContext.split(`${loopContext}.`);
  if (contexts.length !== 2) {
    throw new SystemError(
      `contextName: '${loopContext}' is not correct with context: ${commandContext}`,
    );
  }
  return parseInt(contexts[1], 10);
}

export interface ReplaceMacrosConfig {
  stringWithMacros: string;
  dataStoreContext: TaskDataStoreContext;
  commandDataContext: string;
}

export abstract class MacrosParser {
  public static hasAnyMacros(input: string): boolean {
    return (
      input.search(LINE_MACROS_PATTERN) !== -1 ||
      input.search(OLD_LOOP_INDEX_PATTERN) !== -1 ||
      input.search(LOOP_INDEX_PATTERN) !== -1
    );
  }

  public static parseMacros(input: string): Macros {
    const macros: Macros =
      parseLineMacros(input) ||
      parseLoopMacros(input) ||
      parseOldLoopMacros(input);
    if (!macros) {
      throw new Error(`no macros found in the string: ${input}`);
    }
    return macros;
  }

  public static replaceMacros(config: ReplaceMacrosConfig): string {
    let stringWithMacros = config.stringWithMacros;
    let max = 50;
    while (MacrosParser.hasAnyMacros(stringWithMacros)) {
      if (max < 0) {
        throw new Error(
          `Max loop iteration (${max}) in MacrosParser.replaceMacros`,
        );
      }
      max--;
      const macros = MacrosParser.parseMacros(stringWithMacros);
      switch (macros.type) {
        case 'line':
          const line = config.dataStoreContext[config.commandDataContext] || {};
          let lineValue = line[macros.key] ?? '';
          lineValue =
            lineValue === 'undefined' || lineValue === 'null' ? '' : lineValue;
          stringWithMacros = stringWithMacros.replace(macros.macros, lineValue);
          break;
        case 'loop':
          const loopIndex = resolveLoopIndex(
            config.commandDataContext,
            macros.context,
          );
          stringWithMacros = stringWithMacros.replace(
            macros.macros,
            `[__loop="${loopIndex}"]`,
          );
          break;
      }
    }
    return stringWithMacros;
  }
}
