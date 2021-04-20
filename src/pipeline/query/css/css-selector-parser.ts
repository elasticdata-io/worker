import * as css from 'css-what/lib';
import {
	CSS,
	ElasticSelector,
	ElasticSelectorType,
	CssSelector,
	ParentSelector,
	TextSelector,
	LoopSelector, TextSelectorMode, Xpath,
} from '../models';
import { AttributeAction, Selector } from 'css-what/lib';

type AttributeComparison = '=' | '*=' | '^=' | '$=' | '!=' | '';

function attributeActionMapping(action: AttributeAction)
		: AttributeComparison {
	switch (action) {
		case 'equals':
			return '=';
		case 'any':
			return '*='
		case 'start':
			return '^='
		case 'end':
			return '$='
		case 'not':
			return '!='
		case 'exists':
			return ''
		default:
			throw new Error(`attribute type: ${action} not supporting`)
	}
}

function toCssSelector(css: Selector): CSS {
	switch (css.type) {
		case 'tag':
			return css.name;
		case 'attribute':
			if (css.name === 'class') {
				return `.${css.value}`;
			}
			if (css.name === 'id') {
				return `#${css.value}`;
			}
			const action = attributeActionMapping(css.action);
			return `[${css.name}${action}${css.value}]`;
		case 'descendant':
			return ' ';
		case 'universal':
			return '*';
		case 'child':
			return ' > ';
		default:
			throw new Error(`not supporting selector: ${JSON.stringify(css)}`);
	}
}

function getElasticTypeName(css: Selector): ElasticSelectorType {
	switch (css.type) {
		case 'parent':
			return 'parent';
		case 'attribute':
			if (css.name.startsWith('__text')) {
				return 'text';
			}
			if (css.name.startsWith('__loop')) {
				return 'loop';
			}
			return 'css';
		default:
			return 'css';
	}
}

function textFindMode(action: AttributeAction): TextSelectorMode {
	switch (action) {
		case 'start':
			return 'start';
		case 'end':
			return 'end';
		case 'equals':
			return 'equals';
		case 'any':
			return 'contains';
		case 'not':
			return 'not';
		throw new Error(`text find mode action: ${action} not supporting`);
	}
}

function parseElasticSelector(selectors: Array<Selector>): ElasticSelector {
	if (selectors.length === 0) {
		return null;
	}
	if (selectors.length > 1) {
		const parent = selectors.find(s => s.type === 'parent');
		if (parent) {
			const parentIndexOf = selectors.indexOf(parent);
			selectors.splice(parentIndexOf, 1);
		}
		const css = selectors
			.map(s => toCssSelector(s))
			.join('')
			.trim();
		if (parent) {
			return {
				type: 'parent',
				selector: css,
			} as ParentSelector;
		}
		return { type: 'css', selector: css, } as CssSelector;
	}
	const css = selectors.pop();
	switch (css.type) {
		case 'parent':
			return {
				type: 'parent',
				selector: toCssSelector(css),
			} as ParentSelector;
		case 'attribute':
			if (css.name.startsWith('__text')) {
				return {
					type: 'text',
					text: css.value,
					mode: textFindMode(css.action),
				} as TextSelector;
			}
			if (css.name.startsWith('__loop')) {
				const index = parseInt(css.value, 10) || 0;
				return {
					type: 'loop',
					index: index,
				} as LoopSelector;
			}
			return {
				type: 'css',
				selector: toCssSelector(css),
			} as CssSelector;
		case 'universal':
			return {type: 'css', selector: '*'} as CssSelector
		case 'tag':
			return {
				type: 'css',
				selector: toCssSelector(css)
			} as CssSelector
	}
}

function validate(selector: CSS): void {
	if (selector.trim().startsWith('<')) {
		throw new Error(`invalid selector ${selector}`);
	}
	if (selector.trim().startsWith('[__text')) {
		throw new Error(`invalid selector ${selector}`);
	}
	if (selector.trim().startsWith('[__loop')) {
		throw new Error(`invalid selector ${selector}`);
	}
	if (selector.trim().startsWith('//') || selector.trim().startsWith('(')) {
		throw new Error(`invalid selector ${selector}`);
	}
}

function convertOldMacrosToNew(selector: string) {
	selector = selector.replace(/\{\$i:([0-9a-z]+)\}/gi, `[__loop="$1"]`);
	selector = selector.replace(/\{\$i\}/gi, '[__loop]');
	return selector;
}

/**
 * @deprecated Not used this method - it is private.
 * @param selector
 */
export function getSelectorType(selector: Xpath | CSS): 'css' | 'xpath' {
	selector = selector.trim();
	if (selector.startsWith('//') || selector.startsWith('(')) {
		return 'xpath';
	}
	return 'css';
}

/**
 * @public
 * @param selector Selector with macros
 */
export function parse(selector: CSS) : Array<ElasticSelector> {
	validate(selector);
	// selector = convertOldMacrosToNew(selector);
	const cssSelectors = css.parse(selector);
	const elasticSelectors = [];
	let selectors: Array<Selector> = [];
	for (const selector of cssSelectors[0]) {
		const type = getElasticTypeName(selector);
		switch (type) {
			case 'css':
				selectors.push(selector);
				break;
			case 'parent':
				elasticSelectors.push(parseElasticSelector(selectors));
				selectors = [];
				selectors.push(selector);
				break;
			case 'loop':
			case 'text':
				elasticSelectors.push(parseElasticSelector(selectors));
				selectors = [];
				elasticSelectors.push(parseElasticSelector([selector]));
				break;
			default:
				throw new Error(`type: ${type} is not supporting`)
		}
	}
	if (selectors.length) {
		elasticSelectors.push(parseElasticSelector(selectors));
	}
	return elasticSelectors.filter(Boolean);
}
