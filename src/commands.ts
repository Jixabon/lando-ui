import { window, workspace, env, Uri, QuickPickItem } from 'vscode';
import { toggleButton, outputChannel, getWorkspaceFolderNameFromPath, getWorkspaceFolderPath } from './extension';
import { list, version, dbExport, info, dbExportOut, dbImport } from './lando';
import * as json from 'jsonc-parser';
import * as open from 'open';
import { writeFile, createReadStream, createWriteStream, unlink, copyFile } from 'fs';
import { createGzip } from 'zlib';

export function showOutput() {
  if (workspace.getConfiguration('lando-ui.output').get('autoShow')) {
    outputChannel.show();
  }
}

export async function openURL(url: string) {
  await open(url);
}

export function openTreeItem(offset: number, provider: any) {
  var treeItem = provider.getTreeItem(offset);
  openURL(treeItem.label ? treeItem.label : '');
}

export function copyToClipboard(text: string) {
  env.clipboard.writeText(text).then(() => {
    window.showInformationMessage(`Copied '${text}' to your clipboard`);
  });
}

export function copyTreeItem(offset: number, provider: any) {
  var treeItem = provider.getTreeItem(offset);
  var text = treeItem.label;
  if (treeItem.contextValue == 'string') {
    text = text.split(': ')[1];
  }
  copyToClipboard(text);
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

export function dbUserExport() {
  let infoJson: Array<object> = json.parse(info(getWorkspaceFolderPath()));
  let dbTypes = ['mariadb', 'mangodb', 'mssql', 'mysql'];
  let databaseServices: Array<QuickPickItem> = infoJson
    .filter((service: any) => {
      return dbTypes.includes(service.type);
    })
    .map((service: any) => {
      return { label: service.service, description: 'type: ' + service.type };
    });

  if (databaseServices.length == 1) {
    dbSaveAs(databaseServices[0].label);
  } else {
    window.showQuickPick(databaseServices, { placeHolder: 'Pick a database service to export from' }).then(selected => {
      dbSaveAs(selected ? selected.label : '');
    });
  }
}

function dbSaveDialog(host: string) {
  window
    .showSaveDialog({
      defaultUri: Uri.file(getWorkspaceFolderPath()),
      filters: { 'SQL Data File': ['sql'] },
      saveLabel: 'Export'
    })
    .then(uri => {
      writeDbFile(uri ? uri.path : '', host);
    });
}

function dbSaveAs(host: string) {
  window
    .showQuickPick(
      [
        { label: 'Lando default', description: "Use Lando's default export location" },
        { label: 'My default and name', description: 'Use my configured export location and name file' },
        { label: 'Select and name', description: 'Choose export location and name file' }
      ],
      {
        placeHolder: 'Choose Save operation'
      }
    )
    .then(selected => {
      switch (selected ? selected.label : '') {
        case 'Lando default':
          dbExport(getWorkspaceFolderPath(), host);
          break;

        case 'My default and name':
          window
            .showInputBox({
              prompt: 'Name your SQL file',
              value: 'Untitled.sql',
              validateInput: validateSQLFileName
            })
            .then(userFileName => {
              let exportPath = workspace.getConfiguration('lando-ui.database').get('exportPath');
              if (exportPath != null && exportPath != '') {
                writeDbFile(exportPath + '/' + userFileName, host);
              } else {
                window
                  .showInputBox({
                    prompt: 'Please set your configured export location',
                    validateInput: validateTrailingSlash
                  })
                  .then(userExportPath => {
                    workspace.getConfiguration('lando-ui.database').update('exportPath', userExportPath);
                    writeDbFile(userExportPath + '/' + userFileName, host);
                  });
              }
            });
          break;

        case 'Select and name':
          dbSaveDialog(host);
          break;
      }
    });
}

function writeDbFile(savePath: string, host: string) {
  writeFile(savePath, dbExportOut(getWorkspaceFolderPath(), host), err => {
    if (err) {
      window.showErrorMessage('Failed to write file');
      outputChannel.appendLine('-----------------------');
      outputChannel.append('Failed to write file: ' + err);
      outputChannel.appendLine('-----------------------');
      return;
    }
    var gzip = createGzip();
    var r = createReadStream(savePath);
    var w = createWriteStream(savePath + '.gz');
    r.pipe(gzip).pipe(w);
    unlink(savePath, err => {
      if (err) {
        window.showErrorMessage('Failed to remove unzipped file');
        outputChannel.appendLine('-----------------------');
        outputChannel.append('Failed to remove unzipped file: ' + err);
        outputChannel.appendLine('-----------------------');
        return;
      }
    });
    window.showInformationMessage('Successfully exported database from ' + host);
  });
}

function validateSQLFileName(string: string) {
  return string.match(/\.sql/) ? '' : 'Must contain a .sql extension';
}

function validateTrailingSlash(string: string) {
  return string.match(/\/$/) ? 'Must not have trailing slashes' : '';
}

export function dbUserImport() {
  let infoJson: Array<object> = json.parse(info(getWorkspaceFolderPath()));
  let dbTypes = ['mariadb', 'mangodb', 'mssql', 'mysql'];
  let databaseServices: Array<QuickPickItem> = infoJson
    .filter((service: any) => {
      return dbTypes.includes(service.type);
    })
    .map((service: any) => {
      return { label: service.service, description: 'type: ' + service.type };
    });

  if (databaseServices.length == 1) {
    dbNoWipe(databaseServices[0].label);
  } else {
    window.showQuickPick(databaseServices, { placeHolder: 'Pick a database service to import to' }).then(selected => {
      dbNoWipe(selected ? selected.label : '');
    });
  }
}

function dbNoWipe(host: string) {
  window
    .showQuickPick(
      [
        { label: 'Drop all tables and import' },
        {
          label: 'Import without destroying the target database'
        }
      ],
      {
        placeHolder: 'Choose import behavior'
      }
    )
    .then(selected => {
      switch (selected ? selected.label : '') {
        case 'Drop all tables and import':
          dbOpenDialog(host, false);
          break;

        case 'Import without destroying the target database':
          dbOpenDialog(host, true);
          break;
      }
    });
}

function dbOpenDialog(host: string, noWipe: boolean) {
  window
    .showOpenDialog({
      defaultUri: Uri.file(getWorkspaceFolderPath()),
      canSelectMany: false,
      filters: {
        'SQL Data File, GZipped SQL Data File': ['sql', 'gz', 'gzip']
      },
      openLabel: 'Import'
    })
    .then((uris: any) => {
      let path = uris[0].path;
      if (path.includes(getWorkspaceFolderPath())) {
        dbImport(getWorkspaceFolderPath(), host, noWipe, path.replace(getWorkspaceFolderPath() + '/', ''), false);
      } else {
        let pathArray = path.split('/');
        let fileName: string = 'tmp_' + pathArray[pathArray.length - 1];
        copyFile(path, getWorkspaceFolderPath() + '/' + fileName, err => {
          if (err) {
            window.showErrorMessage('Failed to remove unzipped file');
            outputChannel.appendLine('-----------------------');
            outputChannel.append('Failed to remove unzipped file: ' + err);
            outputChannel.appendLine('-----------------------');
            return;
          }
          dbImport(getWorkspaceFolderPath(), host, noWipe, fileName, true);
        });
      }
    });
}
