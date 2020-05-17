import { window, commands, workspace, ExtensionContext, StatusBarAlignment, ConfigurationTarget, FileSystemWatcher } from 'vscode';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as json from 'jsonc-parser';
import * as lando from './lando';
import { openTreeItem, copyTreeItem, dbUserExport, dbUserImport } from './commands';
import { LandoInfoProvider } from './landoInfoProvider';
import { LandoListProvider } from './landoListProvider';

export var toggleButton: any;
export var outputChannel: any;
export var watcher: FileSystemWatcher;
var workspaceFolderPath: string;
var landoAppConfig: any;
var currentAppName: any;
var firstStart = true;

export function activate(context: ExtensionContext) {
  // ----------------- Create Status Bar Item (button) -----------------
  toggleButton = window.createStatusBarItem(StatusBarAlignment.Right, 3);
  context.subscriptions.push(toggleButton);
  setButtonTo('start');

  // ----------------- Check version of lando (or if it's installed) -----------------
  if (checkVersion()) {
    if (workspace.workspaceFolders != undefined) {
      toggleButton.show();
    }
  } else {
    window.showErrorMessage('Lando is not installed or you are not running the required version.');
  }

  // ----------------- Create Output Channel -----------------
  outputChannel = window.createOutputChannel('Lando UI');
  context.subscriptions.push(outputChannel);

  // ----------------- Get workspace Folder -----------------
  determineWorkspaceFolder();

  // ----------------- Fetch lando file and grab app name from it -----------------
  if (workspaceFolderPath) {
    if (checkLandoFileExists(workspaceFolderPath + '/.lando.yml')) {
      updateCurrentAppConfig(workspaceFolderPath + '/.lando.yml');
      commands.executeCommand('lando-ui.info-refresh');
    } else {
      commands.executeCommand('lando-ui.info-refresh');
    }
  }

  startWatcher();
  context.subscriptions.push(watcher);

  // ----------------- Update the button to reflect workspace folder lando app status -----------------
  refreshToggleButton();

  // ----------------- Tree Providers -----------------
  let landoInfoProvider: LandoInfoProvider = new LandoInfoProvider(context);
  let landoListProvider: LandoListProvider = new LandoListProvider(context);
  let landoInfoView = window.createTreeView('lando-info', {
    treeDataProvider: landoInfoProvider,
  });
  let landoListView = window.createTreeView('lando-list', {
    treeDataProvider: landoListProvider,
  });

  // ----------------- Registering commands -----------------
  let registerCommand = commands.registerCommand;
  context.subscriptions.push(
    ...[
      // lando UI commands
      registerCommand('lando-ui.pickWorkspaceFolder', () => pickWorkspaceFolder()),

      // lando commands
      registerCommand('lando-ui.init', () => lando.init()),
      registerCommand('lando-ui.start', () => lando.start(workspaceFolderPath)),
      registerCommand('lando-ui.stop', () => lando.stop(workspaceFolderPath)),
      registerCommand('lando-ui.restart', () => lando.restart(workspaceFolderPath)),
      registerCommand('lando-ui.rebuild', () => lando.rebuild(workspaceFolderPath)),
      registerCommand('lando-ui.destroy', () => lando.destroy(workspaceFolderPath)),
      registerCommand('lando-ui.poweroff', () => lando.poweroff()),
      registerCommand('lando-ui.db-export', () => dbUserExport()),
      registerCommand('lando-ui.db-import', () => dbUserImport()),

      // lando info panel commands
      registerCommand('lando-ui.info-refresh', () => landoInfoProvider.refresh()),
      registerCommand('lando-ui.info-refreshNode', (offset) => landoInfoProvider.refresh(offset)),
      registerCommand('lando-ui.info-openURL', (offset) => openTreeItem(offset, landoInfoProvider)),
      registerCommand('lando-ui.info-copy', (offset) => copyTreeItem(offset, landoInfoProvider)),
      registerCommand('lando-ui.sshService', (offset) => lando.sshService(offset, landoInfoProvider)),

      // lando list panel commands
      registerCommand('lando-ui.list-refresh', () => landoListProvider.refresh()),
      registerCommand('lando-ui.list-refreshNode', (offset) => landoListProvider.refresh(offset)),
      registerCommand('lando-ui.list-copy', (offset) => copyTreeItem(offset, landoListProvider)),
      registerCommand('lando-ui.stopService', (offset) => lando.stopService(offset, landoListProvider)),
    ]
  );

  // ----------------- Watch for changes in configuration -----------------
  workspace.onDidChangeConfiguration(() => {
    determineWorkspaceFolder();
  });
  workspace.onDidChangeWorkspaceFolders(() => {
    determineWorkspaceFolder();
  });

  firstStart = false;
}

export function checkLandoFileExists(landoFilePath: string): boolean {
  if (fs.existsSync(landoFilePath)) {
    return true;
  } else {
    return false;
  }
}

export function isWorkspaceFolder(folderPath: string) {
  var workspaceFolders = workspace.workspaceFolders ? workspace.workspaceFolders : [];
  var isWorkspaceFolder = false;
  workspaceFolders.forEach((folder) => {
    if (folderPath === folder.uri.fsPath) {
      isWorkspaceFolder = true;
    }
  });
  return isWorkspaceFolder;
}

export function getLandoFile(filePath: string): any {
  return yaml.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getAppNameFromAppConfig(appConfig: any): string {
  return appConfig ? appConfig.name.replace(/[-_\.]/g, '') : '';
}

export function updateCurrentAppConfig(landoFilePath: string) {
  landoAppConfig = getLandoFile(landoFilePath);
  currentAppName = getAppNameFromAppConfig(landoAppConfig);
}

export function pickWorkspaceFolder() {
  window.showWorkspaceFolderPick().then((workspaceFolder) => {
    if (workspaceFolder) {
      workspace.getConfiguration('lando-ui.workspaceFolder').update('default', workspaceFolder.uri.fsPath, ConfigurationTarget.Workspace);
    }
  });
}

export function restartWorkspaceFolderDependents(newWorkspaceFolder: string) {
  workspaceFolderPath = newWorkspaceFolder;
  startWatcher();
  if (checkLandoFileExists(workspaceFolderPath + '/.lando.yml')) {
    updateCurrentAppConfig(workspaceFolderPath + '/.lando.yml');
    commands.executeCommand('lando-ui.info-refresh');
  } else {
    commands.executeCommand('lando-ui.info-refresh');
  }
  refreshToggleButton();
}

export function startWatcher() {
  if (watcher) {
    watcher.dispose();
  }
  watcher = workspace.createFileSystemWatcher(workspaceFolderPath + '/*.yml');
  watcher.onDidCreate((uri) => {
    if (uri.fsPath.includes('.lando.yml')) {
      updateCurrentAppConfig(workspaceFolderPath + '/.lando.yml');
      commands.executeCommand('lando-ui.info-refresh');
      setButtonTo('start');
      if (checkAppRunning(currentAppName)) {
        setButtonTo('stop');
      }
    }
  });
  watcher.onDidChange((uri) => {
    if (uri.fsPath.includes('.lando.yml')) {
      updateCurrentAppConfig(workspaceFolderPath + '/.lando.yml');
      commands.executeCommand('lando-ui.info-refresh');
      setButtonTo('start');
      if (checkAppRunning(currentAppName)) {
        setButtonTo('stop');
      }
    }
  });
  watcher.onDidDelete((uri) => {
    if (!fs.existsSync(workspaceFolderPath + '/.lando.yml')) {
      setButtonTo('init');
      commands.executeCommand('lando-ui.info-refresh');
    }
  });
}

export function getCurrentAppConfig() {
  return landoAppConfig;
}

export function getCurrentAppName() {
  return currentAppName;
}

export function getWorkspaceFolderPath() {
  return workspaceFolderPath;
}

export function getWorkspaceFolderNameFromPath() {
  var pathArray = getWorkspaceFolderPath().split('/');
  return pathArray[getWorkspaceFolderPath().split('/').length - 1];
}

export function determineWorkspaceFolder() {
  var defaultWorkspaceFolderPath: string | undefined = workspace.getConfiguration('lando-ui.workspaceFolder').get('default');

  if (defaultWorkspaceFolderPath != undefined && defaultWorkspaceFolderPath != '') {
    if (isWorkspaceFolder(defaultWorkspaceFolderPath)) {
      workspaceFolderPath = defaultWorkspaceFolderPath;
      if (!firstStart) {
        restartWorkspaceFolderDependents(defaultWorkspaceFolderPath);
      }
    } else if (Object.keys(workspace.workspaceFolders ? workspace.workspaceFolders : []).length > 1) {
      setButtonTo('pick');
      window.showWarningMessage('Your current default Workspace folder does not exists in this Workspace. Please select one to be the default.', ...['Select Default Folder']).then((selection) => {
        if (selection == 'Select Default Folder') {
          pickWorkspaceFolder();
        }
      });
    } else {
      workspaceFolderPath = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : '';
      if (defaultWorkspaceFolderPath != '') {
        workspace.getConfiguration('lando-ui.workspaceFolder').update('default', '', ConfigurationTarget.Workspace);
      }
      commands.executeCommand('lando-ui.info-refresh');
    }
  } else if (Object.keys(workspace.workspaceFolders ? workspace.workspaceFolders : []).length > 1) {
    setButtonTo('pick');
    window.showWarningMessage('There are multiple Workspace folders detected. Please select one to be the default.', ...['Select Default Folder']).then((selection) => {
      if (selection == 'Select Default Folder') {
        pickWorkspaceFolder();
      }
    });
  } else {
    workspaceFolderPath = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : '';
    if (defaultWorkspaceFolderPath != '') {
      workspace.getConfiguration('lando-ui.workspaceFolder').update('default', '', ConfigurationTarget.Workspace);
    }
    commands.executeCommand('lando-ui.info-refresh');
  }
}

export function refreshToggleButton() {
  if (workspaceFolderPath != '' && checkLandoFileExists(workspaceFolderPath + '/.lando.yml')) {
    if (checkAppRunning(currentAppName)) {
      setButtonTo('stop');
    } else {
      setButtonTo('start');
    }
  } else {
    if (!firstStart) {
      setButtonTo('init');
    }
  }
}

export function showOutput() {
  if (workspace.getConfiguration('lando-ui.output').get('autoShow')) {
    outputChannel.show();
  }
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
      toggleButton.text = 'Lando Restarting...';
      toggleButton.command = '';
      break;

    case 'rebuilding':
      toggleButton.text = 'Lando Rebuilding...';
      toggleButton.command = '';
      break;

    case 'destroying':
      toggleButton.text = 'Lando Destroying...';
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

export function checkVersion(): boolean {
  var fullVersion = lando.version();
  // expecting fullVersion format like 'v3.0.0-rc.22' or 'v3.0.0-rrc.1'
  var split = fullVersion.split('-');

  var dotVersion = split[0].substr(1).split('.'); // [3, 0, 0]
  var major = dotVersion[0];
  var minor = dotVersion[1];
  var patch = dotVersion[2];

  var releaseNum = split[1].split('.'); // [rc, 22] or [rrc, 1]

  // make checks against version
  if ((releaseNum[0] == 'rc' && releaseNum[1] >= '13') || (releaseNum[0] == 'rrc' && releaseNum[1] >= '1')) {
    return true;
  }
  return false;
}

export function checkAppRunning(appName: string) {
  var listJSON = lando.list(appName);
  var runningList = json.parse(listJSON);
  return runningList.length > 0;
}
