"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const child_process_1 = require("child_process");
class Lando {
    // private outputChannel: OutputChannel;
    // private startStopButton: StatusBarItem;
    constructor(context) {
        this.workspaceFolderPath = '';
        this.workspaceFolderPath = vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.fsPath : '';
        // this.outputChannel = context.subscriptions[0];
        // this.startStopButton = context.subscriptions[1];
    }
    start() {
        vscode_1.window.showInformationMessage('Starting your Lando app');
        // outputChannel.appendLine('Starting your Lando app');
        // startStopButton.text = 'Lando Starting...';
        child_process_1.exec('lando start', { cwd: this.workspaceFolderPath }, (error, stdout, stderr) => {
            if (error) {
                vscode_1.window.showErrorMessage(stderr);
                // startStopButton.text = 'Lando Start';
                return;
            }
            if (stdout.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
                vscode_1.window.showWarningMessage('Please initiate a lando project: ' + stdout);
                // startStopButton.text = 'Lando Start';
                return;
            }
            if (stdout.includes('Your app has started up correctly.')) {
                vscode_1.window.showInformationMessage('Your Lando app started successfully');
                // outputChannel.appendLine('Your Lando app started successfully');
                // startStopButton.text = 'Lando Stop';
                // startStopButton.command = 'extension.landoStop';
                return;
            }
            //   outputChannel.show();
            //   outputChannel.appendLine(stdout);
        });
    }
    stop() {
        vscode_1.window.showInformationMessage('Stopping your Lando app');
        // outputChannel.appendLine('Stopping your Lando app');
        // startStopButton.text = 'Lando Stopping...';
        child_process_1.exec('lando stop', { cwd: this.workspaceFolderPath }, (error, stdout, stderr) => {
            if (error) {
                vscode_1.window.showErrorMessage(stderr);
                // startStopButton.text = 'Lando Stop';
                return;
            }
            if (stdout.includes('App stopped!') || stdout.includes('Usage: lando')) {
                vscode_1.window.showInformationMessage('Your Lando app stopped successfully');
                // outputChannel.appendLine('Your Lando app stopped successfully');
                // startStopButton.text = 'Lando Start';
                // startStopButton.command = 'extension.landoStart';
            }
            //   outputChannel.show();
            //   outputChannel.appendLine(stdout);
        });
    }
}
exports.Lando = Lando;
//# sourceMappingURL=commands.js.map