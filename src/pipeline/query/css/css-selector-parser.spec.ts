import { parse } from './css-selector-parser';
import { CssSelector, LoopSelector, ParentSelector, ElasticSelector, TextSelector } from '../models';

describe('selector-parser', () => {
	describe('parse', () => {
		describe('when invalid selector', () => {
			it('when [__loop] should throw error', () => {
				const selector = '[__loop]';
				const actual = () => parse(selector);
				expect(actual).toThrow();
			});
			it('when [__text="..."] should throw error', () => {
				const selector = '[__text="..."]';
				const actual = () => parse(selector);
				expect(actual).toThrow();
			});
			it('when < .parent should throw error', () => {
				const selector = '< .parent';
				const actual = () => parse(selector);
				expect(actual).toThrow();
			});
		});
		describe('text selector', () => {
			it('should return contains', () => {
				const selector = '*[__text*="..."]';
				const selectors: ElasticSelector[] = parse(selector);
				expect(selectors).toEqual([
					{
						type: 'css',
						selector: '*',
					} as CssSelector,
					{
						type: 'text',
						text: '...',
						mode: 'contains',
					} as TextSelector,
				]);
			});
			it('should return equals', () => {
				const selector = '*[__text="..."]';
				const selectors: ElasticSelector[] = parse(selector);
				expect(selectors).toEqual([
					{
						type: 'css',
						selector: '*',
					} as CssSelector,
					{
						type: 'text',
						text: '...',
						mode: 'equals',
					} as TextSelector,
				]);
			});
			it('should return start', () => {
				const selector = '*[__text^="..."]';
				const selectors: ElasticSelector[] = parse(selector);
				expect(selectors).toEqual([
					{
						type: 'css',
						selector: '*',
					} as CssSelector,
					{
						type: 'text',
						text: '...',
						mode: 'start',
					} as TextSelector,
				]);
			});
			it('should return end', () => {
				const selector = '*[__text$="..."]';
				const selectors: ElasticSelector[] = parse(selector);
				expect(selectors).toEqual([
					{
						type: 'css',
						selector: '*',
					} as CssSelector,
					{
						type: 'text',
						text: '...',
						mode: 'end',
					} as TextSelector,
				]);
			});
			it('should return not', () => {
				const selector = '*[__text!="..."]';
				const selectors: ElasticSelector[] = parse(selector);
				expect(selectors).toEqual([
					{
						type: 'css',
						selector: '*',
					} as CssSelector,
					{
						type: 'text',
						text: '...',
						mode: 'not',
					} as TextSelector,
				]);
			});
		});
		describe('selector is complex', () => {
			it('should return expected values', () => {
				const selector = 'div.h[__text="Дата публикации"] #child < .parent[sale][__loop][__text*="child text"]';
				const selectors: ElasticSelector[] = parse(selector);
				expect(selectors).toEqual([
					{
						type: 'css',
						selector: 'div.h',
					} as CssSelector,
					{
						type: 'text',
						text: 'Дата публикации',
						mode: 'equals',
					} as TextSelector,
					{
						type: 'css',
						selector: '#child',
					} as CssSelector,
					{
						type: 'parent',
						selector: '.parent[sale]',
					} as ParentSelector,
					{
						type: 'loop',
						index: 0,
					} as LoopSelector,
					{
						type: 'text',
						text: 'child text',
						mode: 'contains',
					} as TextSelector,
				]);
			});
			it('should return expected values', () => {
				const selector = '#loginEdit-el';
				const selectors: ElasticSelector[] = parse(selector);
				expect(selectors).toEqual([
					{
						type: 'css',
						selector: '#loginEdit-el',
					} as CssSelector,
				]);
			});
		});

		describe('backward compatibility support', () => {
			it('should return expected values', () => {
				const selector = 'div.h{$i} #child';
				const selectors: ElasticSelector[] = parse(selector);
				expect(selectors).toEqual([
					{
						type: 'css',
						selector: 'div.h',
					} as CssSelector,
					{
						type: 'loop',
						index: 0,
					} as LoopSelector,
					{
						type: 'css',
						selector: '#child',
					} as CssSelector,
				]);
			});
		});
	});
});
