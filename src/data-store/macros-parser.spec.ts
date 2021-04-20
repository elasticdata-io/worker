import { MacrosParser } from './macros-parser';
import { LineMacros, LoopMacros } from './models';

describe('MacrosParser', () => {
	describe('hasAnyMacros', () => {
		const testCases = [
			{
				macros: '[__loop]',
				expected: true,
			},
			{
				macros: '[__loop="cntx"]',
				expected: true,
			},
			{
				macros: '[__loop1]',
				expected: false,
			},
			{
				macros: '{$i}',
				expected: true,
			},
			{
				macros: '{$i:cntx}',
				expected: true,
			},
			{
				macros: '{$ii}',
				expected: false,
			},
		];

		testCases.forEach(testCase=> {
			it(`when macros is '${testCase.macros}' should return '${testCase.expected}'`, () => {
				const actual = MacrosParser.hasAnyMacros(testCase.macros);
				expect(actual).toBe(testCase.expected);
			});
		})
	});

	describe('parseMacros', () => {
		describe('when with line macros', () => {
			it('should return expected value', () => {
				const actual = MacrosParser.parseMacros('{$line.name}');
				expect(actual).toEqual({
					type: 'line',
					key: 'name',
					macros: '{$line.name}',
				} as LineMacros);
			});
		})

		describe('when with loop index macros', () => {
			it('when with context should return expected value', () => {
				const actual = MacrosParser.parseMacros('[__loop="cntx"]');
				expect(actual).toEqual({
					type: 'loop',
					context: 'cntx',
					macros: '[__loop="cntx"]',
				} as LoopMacros);
			});
			it('when without context should return expected value', () => {
				const actual = MacrosParser.parseMacros(`[__loop='']`);
				expect(actual).toEqual({
					type: 'loop',
					context: undefined,
					macros: `[__loop='']`,
				} as LoopMacros);
			});
		})

		describe('when with old loop index macros', () => {
			it('when with context should return expected value', () => {
				const actual = MacrosParser.parseMacros('{$i:cntx}');
				expect(actual).toEqual({
					type: 'loop',
					context: 'cntx',
					macros: `{$i:cntx}`,
				} as LoopMacros);
			});
			it('when without context should return expected value', () => {
				const actual = MacrosParser.parseMacros('{$i}');
				expect(actual).toEqual({
					type: 'loop',
					context: undefined,
					macros: `{$i}`,
				} as LoopMacros);
			});
		})

		describe('when without macros', () => {
			it('should return expected value', () => {
				const actual = () => MacrosParser.parseMacros('blabla');
				expect(actual).toThrow();
			});
		})

		describe('when complex macros', () => {
			it('should return expected value', () => {
				const actual = MacrosParser.parseMacros('some text {$i} [__loop="cntx"] {$line.name}');
				expect(actual).toEqual({
					type: 'line',
					key: 'name',
					macros: `{$line.name}`,
				} as LineMacros,);
			});
		})
	});

	describe('replaceMacros', () => {
		describe('with complex macros', () => {
			it('should return expected', () => {
				const actual = MacrosParser.replaceMacros({
					stringWithMacros: '.cls[__loop="cntx"] .{$line.name}{$i}',
					commandDataContext: 'root.0.cntx.5',
					dataStoreContext: {
						'root.0.cntx.5': { name: 'value' }
					}
				});
				expect(actual).toBe('.cls[__loop="5"] .value[__loop="0"]');
			});
		})
	})
})
