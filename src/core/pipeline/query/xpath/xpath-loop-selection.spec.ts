import { XpathLoopSelection } from './xpath-loop-selection';
import { AbstractCommand } from '../../command/abstract-command';
import { DataContextResolver } from '../../data/data-context-resolver';

describe('XpathLoopSelection', () => {
	let command: AbstractCommand;
	let dataContextResolver: DataContextResolver;
	let xpathLoopSelection: XpathLoopSelection;

	describe('when selector not has index', () => {
		beforeEach(() => {
			xpathLoopSelection = new XpathLoopSelection();
			dataContextResolver = new DataContextResolver();
			command = {
				uuid: 'uuid',
				selector: "//header//div//div//a",
				getSelector() {
					return this.selector;
				}
			} as AbstractCommand;
		});

		describe('querySelectorAll', () => {
			it('should return expected result', async () => {
				const expected = '$x(`//header//div//div//a`)';
				const actual = xpathLoopSelection.querySelectorAll(command, dataContextResolver);
				expect(actual).toBe(expected);
			});
		});

		describe('querySelector', () => {
			it('should return expected result', async () => {
				const expected = '$x(`//header//div//div//a`)[0]';
				const actual = xpathLoopSelection.querySelector(command, dataContextResolver);
				expect(actual).toBe(expected);
			});
		});
	});
	describe('when selector has single index', () => {
		beforeEach(() => {
			xpathLoopSelection = new XpathLoopSelection();
			dataContextResolver = new DataContextResolver();
			command = {
				uuid: 'uuid',
				selector: "//a{$i:root}//span",
				getSelector() {
					return this.selector;
				}
			} as AbstractCommand;
			dataContextResolver.setContext(command, 'root.5.inner.8');
		});

		describe('querySelectorAll', () => {
			it('should return expected result', async () => {
				const expected = '$x(`(//a)[6]`)';
				const actual = xpathLoopSelection.querySelectorAll(command, dataContextResolver);
				expect(actual).toBe(expected);
			});
		});

		describe('querySelector', () => {
			it('should return expected result', async () => {
				const expected = '$x(`(//a)[6]`)[0]';
				const actual = xpathLoopSelection.querySelector(command, dataContextResolver);
				expect(actual).toBe(expected);
			});
		});
	});
	describe('when selector has multiple index', () => {
		beforeEach(() => {
			xpathLoopSelection = new XpathLoopSelection();
			dataContextResolver = new DataContextResolver();
			command = {
				uuid: 'uuid',
				selector: "//header//div{$i}//div{$i:inner}//a{$i:root}",
				getSelector() {
					return this.selector;
				}
			} as AbstractCommand;
			dataContextResolver.setContext(command, 'root.5.inner.8');
		});

		describe('querySelectorAll', () => {
			it('should return expected result', async () => {
				const expected = '$x(`(((//header//div)[9]//div)[9]//a)[6]`)';
				const actual = xpathLoopSelection.querySelectorAll(command, dataContextResolver);
				expect(actual).toBe(expected);
			});
		});

		describe('querySelector', () => {
			it('should return expected result', async () => {
				const expected = '$x(`(((//header//div)[9]//div)[9]//a)[6]`)[0]';
				const actual = xpathLoopSelection.querySelector(command, dataContextResolver);
				expect(actual).toBe(expected);
			});
		});
	});
});
