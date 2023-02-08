export type CSS = string;
export type Xpath = string;

export type ElasticSelectorType = 'css' | 'text' | 'parent' | 'loop';

export interface ElasticSelector {
  type: ElasticSelectorType;
}

export class CssSelector implements ElasticSelector {
  type: 'css' = 'css';
  selector: CSS;
}

export type TextSelectorMode = 'equals' | 'contains' | 'start' | 'end' | 'not';

export class TextSelector implements ElasticSelector {
  type: 'text' = 'text';
  text: string;
  mode: TextSelectorMode;
}

export class ParentSelector implements ElasticSelector {
  type: 'parent' = 'parent';
  selector: CSS;
}

export class LoopSelector implements ElasticSelector {
  type: 'loop' = 'loop';
  index: number;
}
