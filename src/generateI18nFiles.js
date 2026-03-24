const { registerCommand } = require('./utils/vs');
const { operation } = require('./utils/constant');
const generateI18nFilesLogic = require('./lib/generateI18nFilesLogic');

module.exports = context => {
    context.subscriptions.push(
        registerCommand(operation.generateI18nFiles.cmd, (uri) => {
            generateI18nFilesLogic({ context, uri });
        })
    );
};
