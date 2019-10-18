import { window, commands } from 'vscode';
import { outputChannel } from './extension';
import { exec, execSync } from 'child_process';
import * as json from 'jsonc-parser';
import * as stripAnsi from 'strip-ansi';
import { setButtonTo } from './commands';

export function init(): void {
  var terminal = window.createTerminal('Lando Init');
  terminal.show();
  terminal.sendText('lando init');
}

export function start(dir: string): void {
  outputChannel.show();
  const child = exec('lando start', { cwd: dir });
  child.stdout.on('data', data => {
    if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
      window.showWarningMessage('Please initiate a lando project: ' + data);
      setButtonTo('init');
    }
    if (data.includes('Starting app')) {
      window.showInformationMessage('Starting your Lando app');
      setButtonTo('starting');
    }
    if (data.includes('Your app has started up correctly')) {
      window.showInformationMessage('Your Lando app started successfully');
      setButtonTo('stop');
      commands.executeCommand('lando-ui.info-refresh');
      commands.executeCommand('lando-ui.list-refresh');
    }
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.stderr.on('data', data => {
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.on('exit', (code, signal) => {
    outputChannel.appendLine('-----------------------');
    outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
    outputChannel.appendLine('-----------------------');
  });
}

export function stop(dir: string): void {
  outputChannel.show();
  const child = exec('lando stop', { cwd: dir });
  child.stdout.on('data', data => {
    if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
      window.showWarningMessage('Please initiate a lando project: ' + data);
      setButtonTo('init');
    }
    if (data.includes('Stopping app')) {
      window.showInformationMessage('Stopping your Lando app');
      setButtonTo('stopping');
    }
    if (data.includes('App stopped')) {
      window.showInformationMessage('Your Lando app stopped successfully');
      setButtonTo('start');
      commands.executeCommand('lando-ui.info-refresh');
      commands.executeCommand('lando-ui.list-refresh');
    }
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.stderr.on('data', data => {
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.on('exit', (code, signal) => {
    outputChannel.appendLine('-----------------------');
    outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
    outputChannel.appendLine('-----------------------');
  });
}

export function restart(dir: string): void {
  outputChannel.show();
  const child = exec('lando restart', { cwd: dir });
  child.stdout.on('data', data => {
    if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
      window.showWarningMessage('Please initiate a lando project: ' + data);
      setButtonTo('init');
    }
    if (data.includes('just so we can start it up again')) {
      window.showInformationMessage('Restarting your Lando app');
      setButtonTo('restarting');
    }
    if (data.includes('Your app has started up correctly')) {
      window.showInformationMessage('Your Lando app has restarted successfully');
      setButtonTo('stop');
      commands.executeCommand('lando-ui.info-refresh');
      commands.executeCommand('lando-ui.list-refresh');
    }
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.stderr.on('data', data => {
    outputChannel.append(`${stripAnsi.default(data)}`);
  });
  child.on('exit', (code, signal) => {
    outputChannel.appendLine('-----------------------');
    outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
    outputChannel.appendLine('-----------------------');
  });
}

export function poweroff(): void {
  outputChannel.show();
  const child = exec('lando poweroff', { encoding: 'utf8' });
  child.stdout.on('data', data => {
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
  child.stderr.on('data', data => {
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
      encoding: 'utf8'
    });
    return stdout;
  } catch (e) {
    if (
      e.toString().includes('Could not find app in this dir or a reasonable amount of directories above it') ||
      e.toString().includes("Cannot set property 'opts' of undefined")
    ) {
      window.showWarningMessage('Could not find an app. Please initiate a lando project.');
      return '["No app found"]';
    }
    return '["No app found"]';
  }
}

export function list(): string {
  var stdout = execSync('lando list --format json', { encoding: 'utf8' });
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

export function reformatInfo(info: string): string {
  // ToDo
  var infoJson = json.parse(info);
  return info;
}
