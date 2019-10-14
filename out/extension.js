"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const child_process_1 = require("child_process");
const yaml = require("yaml");
const fs = require("fs");
const json = require("jsonc-parser");
const lando_1 = require("./lando");
const landoInfoProvider_1 = require("./landoInfoProvider");
const landoListProvider_1 = require("./landoListProvider");
let outputChannel;
let toggleButton;
let workspaceFolderPath;
let landoAppConfig;
let currentAppName;
function activate(context) {
    const landoInfoProvider = new landoInfoProvider_1.LandoInfoProvider(context);
    const landoListProvider = new landoListProvider_1.LandoListProvider(context);
    toggleButton = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 3);
    toggleButton.text = 'Lando Start';
    toggleButton.command = 'lando.start';
    context.subscriptions.push(toggleButton);
    outputChannel = vscode_1.window.createOutputChannel('Lando UI');
    context.subscriptions.push(outputChannel);
    let lando = new lando_1.Lando(context, toggleButton, outputChannel);
    workspaceFolderPath = vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.fsPath : '';
    landoAppConfig = yaml.parse(fs.readFileSync(workspaceFolderPath + '/.lando.yml', 'utf8'));
    currentAppName = landoAppConfig.name.replace(/[-_]/g, '');
    child_process_1.exec('lando version', (error, stdout, stderr) => {
        if (error) {
            vscode_1.window.showErrorMessage('Please make sure that lando is installed correctly. ' + stderr);
            return;
        }
        toggleButton.show();
    });
    var listJSON = lando.list();
    var list = json.parse(listJSON);
    if (currentAppName && currentAppName in list) {
        toggleButton.text = 'Lando Stop';
        toggleButton.command = 'lando.stop';
    }
    context.subscriptions.push(vscode_1.commands.registerCommand('lando.start', () => lando.start(workspaceFolderPath)));
    context.subscriptions.push(vscode_1.commands.registerCommand('lando.stop', () => lando.stop(workspaceFolderPath)));
    context.subscriptions.push(vscode_1.commands.registerCommand('lando.poweroff', () => lando.poweroff()));
    vscode_1.window.registerTreeDataProvider('lando-info', landoInfoProvider);
    vscode_1.commands.registerCommand('lando.info-refresh', () => landoInfoProvider.refresh());
    vscode_1.commands.registerCommand('lando.info-refreshNode', offset => landoInfoProvider.refresh(offset));
    vscode_1.window.registerTreeDataProvider('lando-list', landoListProvider);
    vscode_1.commands.registerCommand('lando.list-refresh', () => landoListProvider.refresh());
    vscode_1.commands.registerCommand('lando.list-refreshNode', offset => landoListProvider.refresh(offset));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map