const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { getCustomSetting, getLocales, showMessage, getEditor } = require('../utils/index');
const safeEval = require('safe-eval');

module.exports = ({ context, uri }) => {
  let fileFsPath;
  if (uri && uri.fsPath) {
    fileFsPath = uri.fsPath;
  } else if (uri && uri.path) {
    fileFsPath = uri.path;
  } else {
    const currentEditor = getEditor();
    if (currentEditor) {
      fileFsPath = currentEditor.document.uri.fsPath;
    }
  }

  if (!fileFsPath) {
    showMessage({
      type: 'error',
      message: 'Can not resolve workspace folder without opening a file.',
      needOpen: false
    });
    return;
  }

  const {
    useCompactPathMode = false,
    generateI18nFilesOutputDir = 'src/i18n/lang/zh-cn',
    generateI18nFilesExt = 'auto',
    defaultLocalesPath = 'src/locales',
  } = getCustomSetting(fileFsPath, {
    useCompactPathMode: 'useCompactPathMode',
    generateI18nFilesOutputDir: 'generateI18nFilesOutputDir',
    generateI18nFilesExt: 'generateI18nFilesExt',
    defaultLocalesPath: 'defaultLocalesPath'
  });

  if (!useCompactPathMode) {
    showMessage({
      type: 'error',
      message: 'This feature only works when "useCompactPathMode" is enabled.',
      needOpen: false
    });
    return;
  }

  const { localesPath, exist } = getLocales({
    fsPath: fileFsPath,
    defaultLocalesPath,
    showError: true,
    showInfo: false,
  });

  if (!exist) return;

  fs.readFile(localesPath, 'utf8', (err, data) => {
    if (err) return;

    let _data = {};
    try {
      _data = JSON.parse(data);
    } catch (e) {
      showMessage({ type: 'error', message: 'Failed to parse JSON string of locales.' });
      return;
    }

    const rootPath = getLocales({ fsPath: fileFsPath, isGetRootPath: true, defaultLocalesPath });
    if (!rootPath || typeof rootPath !== 'string') {
      showMessage({ type: 'error', message: 'Could not resolve workspace root path.' });
      return;
    }

    let targetExt = generateI18nFilesExt;
    if (targetExt === 'auto') {
      const tsConfigPath = path.join(rootPath, 'tsconfig.json');
      targetExt = fs.existsSync(tsConfigPath) ? 'ts' : 'js';
    }

    const outputBaseDir = path.isAbsolute(generateI18nFilesOutputDir)
      ? generateI18nFilesOutputDir
      : path.join(rootPath, generateI18nFilesOutputDir);

    Object.keys(_data).forEach((key) => {
      if (typeof _data[key] !== 'object' || Array.isArray(_data[key])) return;

      const obj = _data[key];
      const items = Object.keys(obj).map(k => {
        let val = obj[k] || '';
        val = val.replace(/'/g, "\\'");
        return `  '${k}': '${val}',`;
      });
      if (items.length === 0) return;

      const parts = key.split('.');
      const fileName = parts.pop();
      const relativeDirPath = parts.join(path.sep);
      const targetDir = path.join(outputBaseDir, relativeDirPath);
      const targetFilePath = path.join(targetDir, `${fileName}.${targetExt}`);

      if (fs.existsSync(targetFilePath)) {
        let oldContent = '';
        try {
          oldContent = fs.readFileSync(targetFilePath, 'utf8');
        } catch (e) {
          console.error(`Failed to read existing file: ${targetFilePath}`, e);
          return;
        }

        let existingObj = {};
        let startIndex = oldContent.indexOf('export default');
        let exportDefaultEndIndex = -1;
        
        if (startIndex !== -1) {
          let braceIndex = oldContent.indexOf('{', startIndex);
          if (braceIndex !== -1) {
            let braceCount = 0;
            for (let i = braceIndex; i < oldContent.length; i++) {
              if (oldContent[i] === '{') braceCount++;
              else if (oldContent[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                  exportDefaultEndIndex = i;
                  break;
                }
              }
            }
            if (exportDefaultEndIndex !== -1) {
              const objStr = oldContent.substring(braceIndex, exportDefaultEndIndex + 1);
              try {
                existingObj = safeEval('(' + objStr + ')') || {};
              } catch (e) {
                console.error(`Failed to parse existing file object: ${targetFilePath}`, e);
              }
            }
          }
        }
        
        const newKeys = Object.keys(_data[key]).filter(k => !(k in existingObj));
        if (newKeys.length > 0 && exportDefaultEndIndex !== -1) {
          const newItems = newKeys.map(k => {
            let val = String(_data[key][k] || '').replace(/'/g, "\\'");
            return `  '${k}': '${val}',`;
          });
          
          const beforeBrace = oldContent.substring(0, exportDefaultEndIndex);
          const afterBrace = oldContent.substring(exportDefaultEndIndex);
          const trimmedBefore = beforeBrace.trim();
          let contentStr = '';
          if (trimmedBefore.endsWith('{') || trimmedBefore.endsWith(',')) {
            contentStr = beforeBrace + newItems.join('\n') + '\n' + afterBrace;
          } else {
            contentStr = beforeBrace + ',\n' + newItems.join('\n') + '\n' + afterBrace;
          }
          try {
            fs.writeFileSync(targetFilePath, contentStr, 'utf8');
          } catch (e) {
            console.error(`Failed to write targeted file: ${targetFilePath}`, e);
          }
        }
      } else {
        const itemsToInsert = Object.keys(_data[key]).map(k => {
          let val = _data[key][k] || '';
          val = String(val).replace(/'/g, "\\'");
          return `  '${k}': '${val}',`;
        });
        if (itemsToInsert.length === 0) return;
        mkdirp.sync(targetDir);
        const contentStr = `export default {\n${itemsToInsert.join('\n')}\n};\n`;
        fs.writeFileSync(targetFilePath, contentStr, 'utf8');
      }
    });

    showMessage({
      type: 'info',
      message: `Split i18n files have been generated to ${generateI18nFilesOutputDir} successfully.`,
      needOpen: false
    });
  });
};
