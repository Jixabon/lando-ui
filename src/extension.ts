import { window, commands, workspace, OutputChannel, ExtensionContext, StatusBarAlignment, StatusBarItem } from 'vscode';
import { exec } from 'child_process';
import * as yaml from 'yaml';
import * as fs from 'fs';
import * as json from 'jsonc-parser';
import { Lando } from './lando';
import { LandoInfoProvider } from './landoInfoProvider';
import { LandoListProvider } from './landoListProvider';

let outputChannel: OutputChannel;
let toggleButton: StatusBarItem;
let workspaceFolderPath: string;
let landoAppConfig: any;
let currentAppName: string;

export function activate(context: ExtensionContext) {
  const landoInfoProvider: LandoInfoProvider = new LandoInfoProvider(context);
  const landoListProvider: LandoListProvider = new LandoListProvider(context);

  toggleButton = window.createStatusBarItem(StatusBarAlignment.Right, 3);
  toggleButton.text = 'Lando Start';
  toggleButton.command = 'lando.start';
  context.subscriptions.push(toggleButton);

  outputChannel = window.createOutputChannel('Lando UI');
  context.subscriptions.push(outputChannel);

  let lando = new Lando(context, toggleButton, outputChannel);

  workspaceFolderPath = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : '';

  landoAppConfig = yaml.parse(fs.readFileSync(workspaceFolderPath + '/.lando.yml', 'utf8'));

  currentAppName = landoAppConfig.name.replace(/[-_]/g, '');

  exec('lando version', (error: any, stdout: any, stderr: string) => {
    if (error) {
      window.showErrorMessage('Please make sure that lando is installed correctly. ' + stderr);
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

  context.subscriptions.push(commands.registerCommand('lando.start', () => lando.start(workspaceFolderPath)));
  context.subscriptions.push(commands.registerCommand('lando.stop', () => lando.stop(workspaceFolderPath)));
  context.subscriptions.push(commands.registerCommand('lando.poweroff', () => lando.poweroff()));

  window.registerTreeDataProvider('lando-info', landoInfoProvider);
  commands.registerCommand('lando.info-refresh', () => landoInfoProvider.refresh());
  commands.registerCommand('lando.info-refreshNode', offset => landoInfoProvider.refresh(offset));

  window.registerTreeDataProvider('lando-list', landoListProvider);
  commands.registerCommand('lando.list-refresh', () => landoListProvider.refresh());
  commands.registerCommand('lando.list-refreshNode', offset => landoListProvider.refresh(offset));
}
