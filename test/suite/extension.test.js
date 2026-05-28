const assert = require('assert');
const { before } = require('mocha');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const {
	scriptRegexp,
	propertyRegexp,
	angleBracketSpaceRegexp,
	getI18nKeyAtPosition,
	getI18nKeyMatches
} = require('../../src/utils/regex');
const {
	buildI18nCall,
	getI18nText,
	getTemplateInterpolationArgs
} = require('../../src/utils/interpolation');
const { getLocaleValueByKey } = require('../../src/utils');
const { defaultConfig } = require('../../src/utils/constant');
const packageJson = require('../../package.json');
// const myExtension = require('../extension');

suite('Extension Test Suite', () => {
	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

	test('Sample test', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0));
	});

	test('CJK extraction does not require CJK as the first character', () => {
		const cn = '\u4e2d\u6587\u4e2d\u6587\u4e2d\u6587';
		const mixed = 'english \u4e2d\u6587 text';
		assert.deepStrictEqual(
			`const label = '1. ${cn}...';`.match(scriptRegexp),
			[`'1. ${cn}...'`]
		);
		assert.deepStrictEqual(
			`const label = "${mixed}";`.match(scriptRegexp),
			[`"${mixed}"`]
		);
		assert.deepStrictEqual(
			`<span title="1. ${cn}..."></span>`.match(propertyRegexp),
			[` title="1. ${cn}..."`]
		);
		assert.deepStrictEqual(
			`<span title="${mixed}"></span>`.match(propertyRegexp),
			[` title="${mixed}"`]
		);
		assert.deepStrictEqual(
			`<span>1. ${cn}...</span>`.match(angleBracketSpaceRegexp),
			[`1. ${cn}...`]
		);
		assert.deepStrictEqual(
			`<span>${mixed}</span>`.match(angleBracketSpaceRegexp),
			[mixed]
		);
	});

	test('Template expressions with Chinese remain script matches', () => {
		const mixed = 'english \u4e2d\u6587';
		const lineText = `<span>{{ test ? "${mixed}" : "" }}</span>`;
		assert.strictEqual(lineText.match(angleBracketSpaceRegexp), null);
		assert.deepStrictEqual(lineText.match(scriptRegexp), [`"${mixed}"`]);
	});

	test('Template literal interpolation is normalized and restored as i18n params', () => {
		const normalized =
			'\u672c\u6b21\u5171\u6253\u5370{0}\u4e2a\u8ba2\u5355' +
			'\uff0c\u8bf7\u786e\u8ba4\u662f\u5426\u5df2\u5168\u90e8\u6253\u5370';
		const text =
			'`\u672c\u6b21\u5171\u6253\u5370${successOrderIds.value.length}' +
			'\u4e2a\u8ba2\u5355\uff0c\u8bf7\u786e\u8ba4\u662f\u5426' +
			'\u5df2\u5168\u90e8\u6253\u5370`';
		assert.deepStrictEqual(text.match(scriptRegexp), [text]);
		assert.strictEqual(
			getI18nText(text, /["'`]/g),
			normalized
		);
		assert.deepStrictEqual(
			getTemplateInterpolationArgs(text),
			['successOrderIds.value.length']
		);
		assert.strictEqual(
			buildI18nCall('t', '6gsy9j06ouo0', getTemplateInterpolationArgs(text)),
			"t('6gsy9j06ouo0', [successOrderIds.value.length])"
		);
	});

	test('I18n detail lookup supports generated translate calls', () => {
		const lineText =
			"this.$t('pages.home.title'); $t(\"common.ok\"); t('setup.title'); i18n.t('global.name')";
		assert.deepStrictEqual(
			getI18nKeyMatches(lineText).map(({ key }) => key),
			['pages.home.title', 'common.ok', 'setup.title', 'global.name']
		);
		assert.strictEqual(
			getI18nKeyAtPosition(lineText, lineText.indexOf('setup.title') + 2),
			'setup.title'
		);
	});

	test('I18n detail lookup resolves hash-only keys from nested locale paths', () => {
		const localeObj = {
			'views.account.print_page.print_invoice.index.6gt5yaxm60k0':
				'1.本次共打印${0}个订单，请确认是否已全部打印'
		};
		assert.deepStrictEqual(
			getLocaleValueByKey(localeObj, '6gt5yaxm60k0'),
			{
				exist: true,
				key: 'views.account.print_page.print_invoice.index.6gt5yaxm60k0',
				value: '1.本次共打印${0}个订单，请确认是否已全部打印'
			}
		);
	});

	test('Generated richierc contains every contributed configuration key', () => {
		const contributedKeys = Object.keys(
			packageJson.contributes.configuration.properties
		).map((key) => key.replace('vueSwiftI18nPlus.', ''));
		assert.deepStrictEqual(
			Object.keys(defaultConfig).sort(),
			contributedKeys.sort()
		);
	});
});
