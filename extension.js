const vscode = require('vscode');
const { exec } = require('child_process');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "lando-ui" is now active!');

  let landoStart = vscode.commands.registerCommand(
    'extension.landoStart',
    () => {
      exec('lando start', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          vscode.window.showErrorMessage(stderr);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        vscode.window.showInformationMessage('Starting Lando');
      });
    }
  );
  context.subscriptions.push(landoStart);

  let landoStop = vscode.commands.registerCommand('extension.landoStop', () => {
    exec('lando Stop', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        vscode.window.showErrorMessage(stderr);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      vscode.window.showInformationMessage('Stoping Lando');
    });
  });
  context.subscriptions.push(landoStop);

  let startStopButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    3
  );
  startStopButton.command = 'extension.landoStart';
  startStopButton.text = 'Lando Start';
  context.subscriptions.push(startStopButton);

  exec('lando --version', (error, stdout, stderr) => {
    if (error) {
      vscode.window.showErrorMessage(
        'Please make sure that Lando is installed correctly. ' + stderr
      );
      return;
    }
    startStopButton.show();
  });
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

// function toggleRun() {}

module.exports = {
  activate,
  deactivate
};
