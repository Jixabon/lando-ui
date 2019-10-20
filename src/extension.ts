import { window, commands, workspace, ExtensionContext, StatusBarAlignment } from 'vscode';
import * as fs from 'fs';
import * as yaml from 'yaml';
import * as lando from './lando';
import { openTreeItem, copyTreeItem, checkAppRunning, checkVersion, setButtonTo } from './commands';
import { LandoInfoProvider } from './landoInfoProvider';
import { LandoListProvider } from './landoListProvider';

export var workspaceFolderPath: string;
export var toggleButton: any;
export var outputChannel: any;
var landoAppConfig: any;
var currentAppName: any;

export function activate(context: ExtensionContext) {
  // ----------------- Get workspace Folder -----------------
  workspaceFolderPath = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : '';

  // ----------------- Create Status Bar Item (button) -----------------
  toggleButton = window.createStatusBarItem(StatusBarAlignment.Right, 3);
  context.subscriptions.push(toggleButton);
  setButtonTo('start');

  // ----------------- Create Output Channel -----------------
  outputChannel = window.createOutputChannel('Lando UI');
  context.subscriptions.push(outputChannel);

  // ----------------- Tree Providers -----------------
  let landoInfoProvider: LandoInfoProvider = new LandoInfoProvider(context, workspaceFolderPath);
  let landoListProvider: LandoListProvider = new LandoListProvider(context);
  window.registerTreeDataProvider('lando-info', landoInfoProvider);
  window.registerTreeDataProvider('lando-list', landoListProvider);

  // ----------------- Registering commands -----------------
  let registerCommand = commands.registerCommand;
  context.subscriptions.push(
    ...[
      // lando commands
      registerCommand('lando-ui.init', () => lando.init()),
      registerCommand('lando-ui.start', () => lando.start(workspaceFolderPath)),
      registerCommand('lando-ui.stop', () => lando.stop(workspaceFolderPath)),
      registerCommand('lando-ui.restart', () => lando.restart(workspaceFolderPath)),
      registerCommand('lando-ui.poweroff', () => lando.poweroff()),

      // info panel commands
      registerCommand('lando-ui.info-refresh', () => landoInfoProvider.refresh()),
      registerCommand('lando-ui.info-refreshNode', offset => landoInfoProvider.refresh(offset)),
      registerCommand('lando-ui.info-openURL', offset => openTreeItem(offset, landoInfoProvider)),
      registerCommand('lando-ui.info-copy', offset => copyTreeItem(offset, landoInfoProvider)),

      // list panel commands
      registerCommand('lando-ui.list-refresh', () => landoListProvider.refresh()),
      registerCommand('lando-ui.list-refreshNode', offset => landoListProvider.refresh(offset)),
      registerCommand('lando-ui.list-copy', offset => copyTreeItem(offset, landoListProvider)),
      registerCommand('lando-ui.stopService', offset => lando.stopService(offset, landoListProvider))
    ]
  );

  // ----------------- Check version of lando (or if it's installed) -----------------
  if (checkVersion(lando.version())) {
    toggleButton.show();
  } else {
    window.showErrorMessage('Lando is not installed or you are not running the required version.');
  }

  // ----------------- Fetch lando file and grab app name from it -----------------
  let landoFilePath = workspaceFolderPath + '/.lando.yml';

  if (fs.existsSync(landoFilePath)) {
    updateCurrentAppConfig(landoFilePath);
  } else {
    setButtonTo('init');
  }

  var watcher = workspace.createFileSystemWatcher(workspaceFolderPath + '/*.yml');
  context.subscriptions.push(watcher);
  watcher.onDidCreate(uri => {
    if (uri.fsPath.includes('.lando.yml')) {
      updateCurrentAppConfig(landoFilePath);
      commands.executeCommand('lando-ui.info-refresh');
      setButtonTo('start');
      if (checkAppRunning(currentAppName)) {
        setButtonTo('stop');
      }
    }
  });
  watcher.onDidChange(uri => {
    if (uri.fsPath.includes('.lando.yml')) {
      updateCurrentAppConfig(landoFilePath);
      commands.executeCommand('lando-ui.info-refresh');
    }
  });
  watcher.onDidDelete(uri => {
    if (!fs.existsSync(landoFilePath)) {
      setButtonTo('init');
      commands.executeCommand('lando-ui.info-refresh');
    }
  });

  // -----------------Checking if current app is in the list of running containers -----------------
  if (checkAppRunning(currentAppName)) {
    setButtonTo('stop');
  }
}

export function getLandoFile(filePath: string): any {
  return yaml.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getAppNameFromAppConfig(appConfig: any): string {
  return appConfig ? appConfig.name.replace(/[-_]/g, '') : '';
}

export function updateCurrentAppConfig(landoFilePath: string) {
  landoAppConfig = getLandoFile(landoFilePath);
  currentAppName = getAppNameFromAppConfig(landoAppConfig);
}

export function getCurrentAppConfig() {
  return landoAppConfig;
}

export function getCurrentAppName() {
  return currentAppName;
}
