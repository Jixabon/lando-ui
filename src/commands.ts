import { window } from 'vscode';
import { toggleButton } from './extension';
import { list } from './lando';
import * as json from 'jsonc-parser';
import * as open from 'open';
import * as ncp from 'copy-paste';

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

export function checkVersion(fullVersion: string): boolean {
  // expecting fullVersion format like 'v3.0.0-rc.22'
  var split = fullVersion.split('-');
  split[0] = split[0].substr(1);
  var version = split[1].split('.');
  var major = version[0];
  var minor = version[1];
  var patch = version[2];
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

    default:
      toggleButton.text = 'Loading...';
      toggleButton.command = '';
  }
}
