import { MacrosType } from './macros.model';

export interface LoopMacros extends MacrosType {
  type: 'loop';
  context: string | undefined;
}
