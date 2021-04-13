import { CssSelector, ElasticSelector, LoopSelector, ParentSelector, TextSelector } from '../models';

type JsSelector = string;

export function toJsSelector(selectors: Array<ElasticSelector>) : JsSelector {
	let jsSelectors: JsSelector[] = ['document'];
	for (const selector of selectors) {
		switch (selector.type) {
			case 'css':
				const css = selector as CssSelector;
				jsSelectors.push(`.querySelectorAll(\`${css.selector}\`)`);
				break;
			case 'text':
				const text = selector as TextSelector;
				jsSelectors = ['Array.from(', ...jsSelectors, ')']
				jsSelectors.push(`.filter(x => x.innerText == \`${text.text}\`)`);
				break;
			case 'loop':
				const loop = selector as LoopSelector;
				jsSelectors.push(`[${loop.index}]`);
				break;
			case 'parent':
				const parent = selector as ParentSelector;
				jsSelectors.push(`.closest(\`${parent.selector}\`)`);
				break;
		}
	}
	if (jsSelectors.length > 1) {
		jsSelectors.push('[0]');
	}
	return jsSelectors.join('');
}