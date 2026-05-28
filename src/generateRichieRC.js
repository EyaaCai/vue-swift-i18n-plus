const { registerCommand } = require('./utils/vs');
const { openFileByPath } = require('./utils');
const { operation } = require('./utils/constant');
const generateRichieRC = require('./lib/generateRichieRC');
module.exports = (context) => {
	context.subscriptions.push(
		registerCommand(operation.generateRichieRC.cmd, (uri) => {
			const fsPath = uri && (uri.fsPath || uri.path);
			if (fsPath) {
				openFileByPath(fsPath).then((editor) => {
					generateRichieRC({ editor, context });
				});
			} else {
				generateRichieRC({ context });
			}
		})
	);
};
