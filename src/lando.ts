import { window, commands, workspace } from 'vscode';
import { outputChannel, getAppNameFromAppConfig, getLandoFile, checkAppRunning, getCurrentAppName, getWorkspaceFolderPath, getWorkspaceFolderNameFromPath, showOutput, setButtonTo } from './extension';
import { exec, execSync } from 'child_process';
import * as json from 'jsonc-parser';
import * as stripAnsi from 'strip-ansi';
import { unlink } from 'fs';

export function init(): void {
  var terminal = window.createTerminal('Lando UI');
  terminal.show();
  terminal.sendText('lando init');
}

export function start(dir: string): void {
  showOutput();
  const child = exec('lando start', { cwd: dir });
  child.stdout.on('data', (data) => {
    if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
      window.showWarningMessage('Please initiate a lando project: ' + data);
      setButtonTo('init');
    }
    if (data.includes('Starting app')) {
      window.showInformationMessage('Starting the Lando app ' + getCurrentAppName());
      setButtonTo('starting');
    }
    if (data.includes('Your app has started up correctly')) {
      window.showInformationMessage('The Lando app ' + getCurrentAppName() + ' started successfully');
      setButtonTo('stop');
      commands.executeCommand('lando-ui.info-refresh');
      commands.executeCommand('lando-ui.list-refresh');
    }
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.stderr.on('data', (data) => {
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.on('exit', (code, signal) => {
    outputChannel.appendLine('-----------------------');
    outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
    outputChannel.appendLine('-----------------------');
  });
}

export function stop(dir: string, appName?: string): void {
  showOutput();
  var isCurrentApp: boolean = appName == getCurrentAppName();
  const child = exec('lando stop', { cwd: dir });
  child.stdout.on('data', (data) => {
    if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
      window.showWarningMessage('Please initiate a lando project: ' + data);
      if (isCurrentApp) setButtonTo('init');
    }
    if (data.includes('Stopping app')) {
      window.showInformationMessage('Stopping the Lando app ' + (appName || getCurrentAppName()));
      if (isCurrentApp) setButtonTo('stopping');
    }
    if (data.includes('stopped')) {
      window.showInformationMessage('The Lando app ' + (appName || getCurrentAppName()) + ' stopped successfully');
      if (isCurrentApp) setButtonTo('start');
      commands.executeCommand('lando-ui.info-refresh');
      commands.executeCommand('lando-ui.list-refresh');
    }
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.stderr.on('data', (data) => {
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.on('exit', (code, signal) => {
    outputChannel.appendLine('-----------------------');
    outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
    outputChannel.appendLine('-----------------------');
  });
}

export function stopService(offset: number, provider: any): void {
  var landoFile = '';
  var app = provider.getNode(offset);
  var service = provider.getNode(provider.getChildrenOffsets(app)[0]);
  provider.getChildrenOffsets(service).forEach((offset: number) => {
    var prop = provider.getNode(offset);
    if (prop.parent.children[0].value == 'src') {
      landoFile = provider.getNode(provider.getChildrenOffsets(prop)[0]).value;
    }
  });
  var appName = getAppNameFromAppConfig(getLandoFile(landoFile));

  var dir = landoFile.replace('/.lando.yml', '');
  stop(dir, appName);
}

export function restart(dir: string): void {
  showOutput();
  const child = exec('lando restart', { cwd: dir });
  child.stdout.on('data', (data) => {
    if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
      window.showWarningMessage('Please initiate a lando project: ' + data);
      setButtonTo('init');
    }
    if (data.includes('just so we can start it up again') || data.includes('Stopping and restarting your app')) {
      window.showInformationMessage('Restarting the Lando app ' + getCurrentAppName());
      setButtonTo('restarting');
    }
    if (data.includes('Your app has started up correctly')) {
      window.showInformationMessage('The Lando app ' + getCurrentAppName() + ' has restarted successfully');
      setButtonTo('stop');
      commands.executeCommand('lando-ui.info-refresh');
      commands.executeCommand('lando-ui.list-refresh');
    }
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.stderr.on('data', (data) => {
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.on('exit', (code, signal) => {
    outputChannel.appendLine('-----------------------');
    outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
    outputChannel.appendLine('-----------------------');
  });
}

export function rebuild(dir: string): void {
  window.showQuickPick(['Cancel', 'Confirm'], { placeHolder: 'Are you sure you want to rebuild your app?' }).then((selected) => {
    if (selected == 'Confirm') {
      showOutput();
      const child = exec('lando rebuild -y', { cwd: dir });
      child.stdout.on('data', (data) => {
        if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
          window.showWarningMessage('Please initiate a lando project: ' + data);
          setButtonTo('init');
        }
        if (data.includes('Rebuilding app')) {
          window.showInformationMessage('Rebuilding the Lando app ' + getCurrentAppName());
          setButtonTo('rebuilding');
        }
        if (data.includes('Your app has started up correctly')) {
          window.showInformationMessage('The Lando app ' + getCurrentAppName() + ' has rebuilt successfully');
          setButtonTo('stop');
          commands.executeCommand('lando-ui.info-refresh');
          commands.executeCommand('lando-ui.list-refresh');
        }
        outputChannel.append(`${stripAnsi.default(data)}`);
      });
      child.stderr.on('data', (data) => {
        outputChannel.append(`${stripAnsi.default(data)}`);
      });
      child.on('exit', (code, signal) => {
        outputChannel.appendLine('-----------------------');
        outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
        outputChannel.appendLine('-----------------------');
      });
    }
  });
}

export function destroy(dir: string): void {
  window.showQuickPick(['Cancel', 'Confirm'], { placeHolder: 'Are you sure you want to destroy your app?' }).then((selected) => {
    if (selected == 'Confirm') {
      showOutput();
      const child = exec('lando destroy -y', { cwd: dir });
      child.stdout.on('data', (data) => {
        if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
          window.showWarningMessage('Please initiate a lando project: ' + data);
          setButtonTo('init');
        }
        if (data.includes('dustbin of history')) {
          window.showInformationMessage('Destroying the Lando app ' + getCurrentAppName());
          setButtonTo('destroying');
        }
        if (data.includes('App destroyed')) {
          window.showInformationMessage('The Lando app ' + getCurrentAppName() + ' has been destroyed');
          setButtonTo('start');
          commands.executeCommand('lando-ui.info-refresh');
          commands.executeCommand('lando-ui.list-refresh');
        }
        outputChannel.append(`${stripAnsi.default(data)}`);
      });
      child.stderr.on('data', (data) => {
        outputChannel.append(`${stripAnsi.default(data)}`);
      });
      child.on('exit', (code, signal) => {
        outputChannel.appendLine('-----------------------');
        outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
        outputChannel.appendLine('-----------------------');
      });
    }
  });
}

export function poweroff(): void {
  showOutput();
  const child = exec('lando poweroff', { encoding: 'utf8' });
  child.stdout.on('data', (data) => {
    if (data.includes('Spinning Lando containers down')) {
      window.showInformationMessage('Powering off Lando');
    }
    if (data.includes('Lando containers have been spun down')) {
      window.showInformationMessage('Lando has been powered off successfully');
      setButtonTo('start');
      commands.executeCommand('lando-ui.info-refresh');
      commands.executeCommand('lando-ui.list-refresh');
    }
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.stderr.on('data', (data) => {
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.on('exit', (code, signal) => {
    outputChannel.appendLine('-----------------------');
    outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
    outputChannel.appendLine('-----------------------');
  });
}

export function info(dir: string): string {
  try {
    var stdout = execSync('lando info --format json', {
      cwd: dir,
      encoding: 'utf8',
    });
    return stdout;
  } catch (e) {
    if (e.toString().includes('Could not find app in this dir or a reasonable amount of directories above it') || e.toString().includes("Cannot set property 'opts' of undefined")) {
      return '[]';
    }
    return '[]';
  }
}

export function list(appName?: string): string {
  var command = 'lando list --format json';
  if (appName != undefined) command = command + ' --filter "app=' + appName + '"';
  var stdout = execSync(command, { encoding: 'utf8' });
  return stdout;
}

export function config(): string {
  var stdout = execSync('lando config --format json', { encoding: 'utf8' });
  return stdout;
}

export function version(): string {
  var stdout = execSync('lando version', { encoding: 'utf8' });
  return stdout;
}

export function dbExport(dir: string, host?: string, filePath?: string) {
  let command = 'lando db-export';
  if (host) command += ' -h ' + host;
  if (filePath) command += ' "' + filePath + '"';

  const child = exec(command, { cwd: dir });
  child.stdout.on('data', (data) => {
    if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
      window.showWarningMessage('Please initiate a lando project: ' + data);
      setButtonTo('init');
    }
    if (data.includes('Failed')) {
      window.showWarningMessage('Failed to export database from ' + host);
    }
    if (data.includes('Success')) {
      window.showInformationMessage('Successfully exported database from ' + host);
    }
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.stderr.on('data', (data) => {
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.on('exit', (code, signal) => {
    outputChannel.appendLine('-----------------------');
    outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
    outputChannel.appendLine('-----------------------');
  });
}

export function dbExportCustom(dir: string, host?: string, filePath?: string) {
  let command = 'lando db-export';
  if (host) command += ' -h ' + host;
  if (filePath) command += ' "' + filePath + '"';

  var stdout = execSync(command, { cwd: dir });
  if (stdout.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
    window.showWarningMessage('Please initiate a lando project');
    setButtonTo('init');
  }
  if (stdout.includes('Failed')) {
    window.showWarningMessage('Failed to export database from ' + host);
  }
}

export function dbImport(dir: string, host?: string, noWipe?: boolean, filePath?: string, isTmp?: boolean) {
  let command = 'lando db-import';
  if (host) command += ' -h ' + host;
  if (noWipe) command += ' --no-wipe';
  if (filePath) command += ' "' + filePath + '"';

  const child = exec(command, { cwd: dir });
  child.stdout.on('data', (data) => {
    if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
      window.showWarningMessage('Please initiate a lando project: ' + data);
      setButtonTo('init');
    }
    if (data.includes('not found')) {
      window.showWarningMessage('Failed to import database into ' + host);
    }
    if (data.includes('Preparing to import')) {
      window.showInformationMessage('Importing database into ' + host);
    }
    if (data.includes('Import complete')) {
      window.showInformationMessage('Successfully imported database to ' + host);
    }
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.stderr.on('data', (data) => {
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.on('exit', (code, signal) => {
    outputChannel.appendLine('-----------------------');
    outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
    outputChannel.appendLine('-----------------------');
    if (isTmp) {
      unlink(getWorkspaceFolderPath() + '/' + filePath, (err) => {
        if (err) {
          window.showErrorMessage('Failed to remove tmp import file');
          outputChannel.appendLine('-----------------------');
          outputChannel.appendLine('Failed to remove tmp import file: ' + err);
          outputChannel.appendLine('-----------------------');
          return;
        }
      });
    }
  });
}

export function sshService(offset: number, provider: any): void {
  var treeItem = provider.getTreeItem(offset);
  var terminal = window.createTerminal('Lando ' + treeItem.label);
  terminal.show();
  terminal.sendText('lando ssh -s ' + treeItem.label);
}

export function reformatInfo(info: string): string {
  var newInfo: { [k: string]: any } = {};
  var infoJson = json.parse(info);
  infoJson.forEach((element: any) => {
    var service = element.service;
    delete element.service;
    newInfo['service_' + service] = element;
  });
  return JSON.stringify(newInfo);
}

export function reformatList(list: string): string {
  var listJson = json.parse(list);
  var fullVersion: string = version();
  if (fullVersion.includes('-rc.')) {
    var prop: any;
    for (prop in listJson) {
      if (listJson.hasOwnProperty(prop)) {
        var services: { [k: string]: any } = {};
        listJson[prop].forEach((element: any) => {
          var service = element.service;
          delete element.service;
          services[service] = element;
        });
        listJson['service_' + prop] = services;
        delete listJson[prop];
      }
    }
    return JSON.stringify(listJson);
  } else {
    var newList: { [k: string]: any } = {};
    listJson.forEach((element: any) => {
      var prop = 'service_' + element.app;
      delete element.app;
      if (!(prop in newList)) newList[prop] = {};
      var service = element.service;
      delete element.service;
      newList[prop][service] = element;
    });
    return JSON.stringify(newList);
  }
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
