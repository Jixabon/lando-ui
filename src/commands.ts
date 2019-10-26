import { window, workspace } from 'vscode';
import { toggleButton, outputChannel, getWorkspaceFolderNameFromPath } from './extension';
import { list, version } from './lando';
import * as json from 'jsonc-parser';
import * as open from 'open';
// import * as ncp from 'copy-paste';

export function showOutput() {
  if (workspace.getConfiguration('lando-ui.output').get('autoShow')) {
    outputChannel.show();
  }
}

export async function openURL(url: string) {
  await open(url);
}

export function openTreeItem(offset: any, provider: any) {
  var treeItem = provider.getTreeItem(offset);
  openURL(treeItem.label ? treeItem.label : '');
}

export function copyToClipboard(text: string) {
  // ToDo
  // ncp.copy(text, () => {
  //   window.showInformationMessage(`Copied '${text}' to your clipboard`);
  // });
  window.showInformationMessage('Clipboard Feature Coming Soon');
}

export function copyTreeItem(offset: any, provider: any) {
  var treeItem = provider.getTreeItem(offset);
  copyToClipboard(treeItem.label ? treeItem.label : '');
}

export function checkVersion(): boolean {
  var fullVersion = version();
  // expecting fullVersion format like 'v3.0.0-rc.22'
  var split = fullVersion.split('-');
  split[0] = split[0].substr(1);
  var dotVersion = split[1].split('.');
  var major = dotVersion[0];
  var minor = dotVersion[1];
  var patch = dotVersion[2];
  var rcNum = split[1].split('.')[1];

  if (rcNum >= '13') {
    return true;
  }
  return false;
}

export function checkAppRunning(appName: string) {
  var listJSON = list();
  var runningList = json.parse(listJSON);
  if (appName in runningList) {
    return true;
  }
  return false;
}

export function addWorkspaceFolderName(jsonString: string): string {
  var parse = json.parse(jsonString);
  var newObject: any = {};
  if (Object.keys(workspace.workspaceFolders ? workspace.workspaceFolders : []).length > 1) {
    newObject['Workspace Folder'] = getWorkspaceFolderNameFromPath();
  }
  for (var element in parse) {
    newObject[element] = parse[element];
  }
  return JSON.stringify(newObject);
}

export function setButtonTo(mode: string) {
  switch (mode) {
    case 'start':
      toggleButton.text = 'Lando Start';
      toggleButton.command = 'lando-ui.start';
      break;

    case 'starting':
      toggleButton.text = 'Lando Starting...';
      toggleButton.command = '';
      break;

    case 'stop':
      toggleButton.text = 'Lando Stop';
      toggleButton.command = 'lando-ui.stop';
      break;

    case 'stopping':
      toggleButton.text = 'Lando Stopping...';
      toggleButton.command = '';
      break;

    case 'restarting':
      toggleButton.text = 'Lando Restarting..';
      toggleButton.command = '';
      break;

    case 'rebuilding':
      toggleButton.text = 'Lando Rebuilding..';
      toggleButton.command = '';
      break;

    case 'destroying':
      toggleButton.text = 'Lando Destroying..';
      toggleButton.command = '';
      break;

    case 'init':
      toggleButton.text = 'Lando Init';
      toggleButton.command = 'lando-ui.init';
      break;

    case 'pick':
      toggleButton.text = 'Lando Pick Folder';
      toggleButton.command = 'lando-ui.pickWorkspaceFolder';
      break;

    default:
      toggleButton.text = 'Loading...';
      toggleButton.command = '';
      break;
  }
}
