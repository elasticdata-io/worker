import { LoopMacros } from './loop-macros.model';
import { LineMacros } from './line-macros.model';

export interface MacrosType {
  type: 'loop' | 'line';
  macros: string;
}

export type Macros = LoopMacros | LineMacros;
