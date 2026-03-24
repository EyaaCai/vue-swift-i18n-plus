const constants = {
  defaultStyle: {
    fontStyle: 'italic',
    // textDecoration: "underline solid green"
  },
  errorStyle: {
    fontStyle: 'italic',
    // textDecoration: "underline solid red"
  },
  langArr: [
    'javascript',
    'vue',
    'typescript',
    'typescriptreact',
    'javascriptreact',
  ],
  operation: {
    flatJson: { cmd: 'vueSwiftI18nPlus.flatJson', title: 'Flat Json' },
    unFlatJson: { cmd: 'vueSwiftI18nPlus.unFlatJson', title: 'unFlat Json' },
    showI18n: {
      cmd: 'vueSwiftI18nPlus.showI18n',
      title: 'Show I18n Translate Detail',
    },
    updateI18n: {
      cmd: 'vueSwiftI18nPlus.updateI18n',
      title: 'Update I18n Locales Json',
    },
    generateRichieRC: {
      cmd: 'vueSwiftI18nPlus.generateRichieRC',
      title: 'Generate scope config file',
    },
    swiftI18n: { cmd: 'vueSwiftI18nPlus.swiftI18n', title: 'Swift I18n' },
    hoverI18n: { cmd: 'vueSwiftI18nPlus.hoverI18n', title: 'Hover I18n' },
    openI18nFile: { cmd: 'vueSwiftI18nPlus.openI18nFile', title: 'Open File' },
    generateI18nFiles: { cmd: 'vueSwiftI18nPlus.generateI18nFiles', title: 'Generate Split I18n Files' },
  },
  plugin: {
    name: 'vue-swift-i18n-plus',
    congratulations:
      'Congratulations, your extension "vue-swift-i18n-plus" is now active!',
    noUri: 'please selected a json file first',
  },
  defaultConfig: {
    defaultLocalesPath: 'src/locales',
    puidType: 'short',
    i18nValueHover: true,
    langFile: 'zh-cn.json',
    modulePrefixFoUpdateJson: '',
    notAlertBeforeUpdateI18n: false,
    fileNameSubstitute: 'components',
    notUseFileNameAsKey: false,
    parentDirLevel: 1,
  },

  pkgFileName: 'package.json',
  customConfigFileName: 'richierc.json',
};
module.exports = constants;
