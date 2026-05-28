const templateInterpolationRegexp = /\$\{([^{}]+)\}/g;

const hasTemplateInterpolation = (str = '') =>
  str.startsWith('`') &&
  str.endsWith('`') &&
  /\$\{[^{}]+\}/.test(str);

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

const getTemplateInterpolationArgs = (str = '') => {
  if (!hasTemplateInterpolation(str)) return [];
  const args = [];
  stripWrapperQuotes(str).replace(templateInterpolationRegexp, (_, expression) => {
    args.push(expression.trim());
    return _;
  });
  return args;
};

const getI18nText = (str = '', resoloveReg) => {
  if (hasTemplateInterpolation(str)) {
    return normalizeTemplateInterpolation(str);
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
  hasTemplateInterpolation,
  normalizeTemplateInterpolation,
};
