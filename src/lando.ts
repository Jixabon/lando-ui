import { ExtensionContext, window, OutputChannel, StatusBarItem, commands } from 'vscode';
import { exec, execSync } from 'child_process';
import * as stripAnsi from 'strip-ansi';

export class Lando {
  private toggleButton: any;
  private outputChannel: any;

  constructor(context: ExtensionContext, toggleButton?: StatusBarItem, outputChannel?: OutputChannel) {
    this.toggleButton = toggleButton;
    this.outputChannel = outputChannel;
  }

  public init() {}

  public start(dir: string): void {
    const child = exec('lando start', { cwd: dir });
    child.stdout.on('data', data => {
      if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
        window.showWarningMessage('Please initiate a lando project: ' + data);
        this.toggleButton.text = 'Lando Start';
        this.toggleButton.command = 'lando.start';
      }
      if (data.includes('Starting app')) {
        window.showInformationMessage('Starting your Lando app');
        this.toggleButton.text = 'Starting...';
        this.toggleButton.command = '';
      }
      if (data.includes('Your app has started up correctly')) {
        window.showInformationMessage('Your Lando app started successfully');
        this.toggleButton.text = 'Lando Stop';
        this.toggleButton.command = 'lando.stop';
        commands.executeCommand('lando.list-refresh');
      }
      this.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.stderr.on('data', data => {
      this.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.on('exit', (code, signal) => {
      this.outputChannel.appendLine('-----------------------');
      this.outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
      this.outputChannel.appendLine('-----------------------');
    });
  }

  public stop(dir: string): void {
    const child = exec('lando stop', { cwd: dir });
    child.stdout.on('data', data => {
      if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
        window.showWarningMessage('Please initiate a lando project: ' + data);
        this.toggleButton.text = 'Lando Stop';
        this.toggleButton.command = 'lando.stop';
      }
      if (data.includes('Stopping app')) {
        window.showInformationMessage('Stopping your Lando app');
        this.toggleButton.text = 'Stopping...';
        this.toggleButton.command = '';
      }
      if (data.includes('App stopped')) {
        window.showInformationMessage('Your Lando app stopped successfully');
        this.toggleButton.text = 'Lando Start';
        this.toggleButton.command = 'lando.start';
        commands.executeCommand('lando.list-refresh');
      }
      this.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.stderr.on('data', data => {
      this.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.on('exit', (code, signal) => {
      this.outputChannel.appendLine('-----------------------');
      this.outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
      this.outputChannel.appendLine('-----------------------');
    });
  }

  public info(dir: string): string {
    try {
      var stdout = execSync('lando info --format json', { cwd: '/Users/shawn/Documents/Projects/lando/lando_ui_test', encoding: 'utf8' });
      return stdout;
    } catch (e) {
      if (
        e.toString().includes('Could not find app in this dir or a reasonable amount of directories above it') ||
        e.toString().includes("Cannot set property 'opts' of undefined")
      ) {
        window.showWarningMessage('Please initiate a lando project: ' + e);
        return 'warn: Could not find app in this dir or a reasonable amount of directories about it';
      }
      return 'warn: Could not find app in this dir or a reasonable amount of directories about it';
    }
    // return '{"appserver": ["Testing"]}';
  }

  public list(): string {
    var stdout = execSync('lando list --format json', { encoding: 'utf8' });
    return stdout;
  }

  public config(): string {
    var stdout = execSync('lando config --format json', { encoding: 'utf8' });
    return stdout;
  }

  public version(): string {
    var stdout = execSync('lando version', { encoding: 'utf8' });
    return stdout;
  }

  public poweroff(): void {
    const child = exec('lando poweroff', { encoding: 'utf8' });
    child.stdout.on('data', data => {
      if (data.includes('Spinning Lando containers down')) {
        window.showInformationMessage('Powering off Lando');
      }
      if (data.includes('Lando containers have been spun down')) {
        window.showInformationMessage('Lando has been powered off started successfully');
        commands.executeCommand('lando.list-refresh');
      }
      this.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.stderr.on('data', data => {
      this.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.on('exit', (code, signal) => {
      this.outputChannel.appendLine('-----------------------');
      this.outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
      this.outputChannel.appendLine('-----------------------');
    });
  }
}
