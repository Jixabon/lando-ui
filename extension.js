const vscode = require('vscode');
const { exec } = require('child_process');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "lando-ui" is now active!');

  let folderPath = vscode.workspace.rootPath;

  let landoStart = vscode.commands.registerCommand('extension.landoStart', () => {
    startStopButton.text = 'Lando Starting...';
    exec('lando start', { cwd: folderPath }, (error, stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage(stderr);
        startStopButton.text = 'Lando Start';
        return;
      }
      if (stdout.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
        vscode.window.showWarningMessage('Please initiate a lando project: ' + stdout);
        startStopButton.text = 'Lando Start';
        return;
      }
      if (stdout.includes('Your app has started up correctly.')) {
        vscode.window.showInformationMessage('Lando Started Successfully');
        startStopButton.text = 'Lando Stop';
        startStopButton.command = 'extension.landoStop';
        return;
      }
    });
  });
  context.subscriptions.push(landoStart);

  let landoStop = vscode.commands.registerCommand('extension.landoStop', () => {
    startStopButton.text = 'Lando Stopping...';
    exec('lando Stop', (error, stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage(stderr);
        startStopButton.text = 'Lando Stop';
        return;
      }
      if (stdout.includes('App stopped!')) {
        vscode.window.showInformationMessage('Lando Stopped Successfully');
        startStopButton.text = 'Lando Start';
        startStopButton.command = 'extension.landoStart';
      }
    });
  });
  context.subscriptions.push(landoStop);

  let startStopButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 3);
  startStopButton.command = 'extension.landoStart';

  startStopButton.text = 'Lando Start';
  context.subscriptions.push(startStopButton);

  // when vscode starts check that lando is installed correctly.
  // If so show the StatusBarItem.
  exec('lando version', (error, stdout, stderr) => {
    if (error) {
      vscode.window.showErrorMessage('Please make sure that lando is installed correctly. ' + stderr);
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
