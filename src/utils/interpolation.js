const templateInterpolationRegexp = /\$\{([^{}]+)\}/g;
const vueTemplateInterpolationRegexp = /\{\{\s*([^]*?)\s*\}\}/g;
const interpolationLiteralRegexp =
  /(["'])(?:\\.|(?!\1)[^\\\r\n])*[\u4e00-\u9fa5](?:\\.|(?!\1)[^\\\r\n])*\1/g;

const hasTemplateInterpolation = (str = '') =>
  str.startsWith('`') &&
  str.endsWith('`') &&
  /\$\{[^{}]+\}/.test(str);

const hasVueTemplateInterpolation = (str = '') =>
  /\{\{[^]*?\}\}/.test(str);

const stripWrapperQuotes = (str = '') =>
  str.replace(/^["'`]|["'`]$/g, '');

const normalizeTemplateInterpolation = (str = '') => {
  let index = 0;
  return stripWrapperQuotes(str).replace(templateInterpolationRegexp, () => {
    const result = '{' + index + '}';
    index += 1;
    return result;
  });
};

const normalizeVueTemplateInterpolation = (str = '') => {
  let index = 0;
  return str.replace(vueTemplateInterpolationRegexp, () => {
    const result = '{' + index + '}';
    index += 1;
    return result;
  });
};

const getTemplateInterpolationArgs = (str = '') => {
  if (!hasTemplateInterpolation(str)) return [];
  const args = [];
  stripWrapperQuotes(str).replace(templateInterpolationRegexp, (_, expression) => {
    args.push(expression.trim());
    return _;
  });
  return args;
};

const getTemplateInterpolationLiteralTexts = (str = '') => {
  if (!hasTemplateInterpolation(str)) return [];
  const texts = [];
  stripWrapperQuotes(str).replace(templateInterpolationRegexp, (_, expression) => {
    let match;
    interpolationLiteralRegexp.lastIndex = 0;
    while ((match = interpolationLiteralRegexp.exec(expression))) {
      texts.push(stripWrapperQuotes(match[0]));
    }
    interpolationLiteralRegexp.lastIndex = 0;
    return _;
  });
  return texts;
};

const resolveTemplateInterpolationArg = (arg = '', localeObj = {}, funcName) => {
  if (!arg || !funcName) return arg;
  return arg.replace(interpolationLiteralRegexp, (literal) => {
    const text = literal.slice(1, -1);
    const key = localeObj[text];
    return key ? buildI18nCall(funcName, key) : literal;
  });
};

const getVueTemplateInterpolationArgs = (str = '') => {
  if (!hasVueTemplateInterpolation(str)) return [];
  const args = [];
  str.replace(vueTemplateInterpolationRegexp, (_, expression) => {
    args.push(expression.trim());
    return _;
  });
  return args;
};

const getI18nText = (str = '', resoloveReg, options = {}) => {
  if (hasTemplateInterpolation(str)) {
    return normalizeTemplateInterpolation(str);
  }
  if (options.vueTemplate) {
    const text = hasVueTemplateInterpolation(str)
      ? normalizeVueTemplateInterpolation(str)
      : str;
    return text.trim();
  }
  return str.replace(resoloveReg, '');
};

const buildI18nCall = (funcName, key, args = []) => {
  const params = args.length > 0 ? `, [${args.join(', ')}]` : '';
  return `${funcName}('${key}'${params})`;
};

module.exports = {
  buildI18nCall,
  getI18nText,
  getTemplateInterpolationArgs,
  getTemplateInterpolationLiteralTexts,
  resolveTemplateInterpolationArg,
  getVueTemplateInterpolationArgs,
  hasTemplateInterpolation,
  hasVueTemplateInterpolation,
  normalizeTemplateInterpolation,
  normalizeVueTemplateInterpolation,
};
