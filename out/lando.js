"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const child_process_1 = require("child_process");
const stripAnsi = require("strip-ansi");
class Lando {
    constructor(context, toggleButton, outputChannel) {
        this.toggleButton = toggleButton;
        this.outputChannel = outputChannel;
    }
    start(dir) {
        const child = child_process_1.exec('lando start', { cwd: dir });
        child.stdout.on('data', data => {
            if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
                vscode_1.window.showWarningMessage('Please initiate a lando project: ' + data);
                this.toggleButton.text = 'Lando Start';
                this.toggleButton.command = 'lando.start';
            }
            if (data.includes('Starting app')) {
                vscode_1.window.showInformationMessage('Starting your Lando app');
                this.toggleButton.text = 'Starting...';
                this.toggleButton.command = '';
            }
            if (data.includes('Your app has started up correctly')) {
                vscode_1.window.showInformationMessage('Your Lando app started successfully');
                this.toggleButton.text = 'Lando Stop';
                this.toggleButton.command = 'lando.stop';
                vscode_1.commands.executeCommand('lando.info-refresh');
                vscode_1.commands.executeCommand('lando.list-refresh');
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
    stop(dir) {
        const child = child_process_1.exec('lando stop', { cwd: dir });
        child.stdout.on('data', data => {
            if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
                vscode_1.window.showWarningMessage('Please initiate a lando project: ' + data);
                this.toggleButton.text = 'Lando Stop';
                this.toggleButton.command = 'lando.stop';
            }
            if (data.includes('Stopping app')) {
                vscode_1.window.showInformationMessage('Stopping your Lando app');
                this.toggleButton.text = 'Stopping...';
                this.toggleButton.command = '';
            }
            if (data.includes('App stopped')) {
                vscode_1.window.showInformationMessage('Your Lando app stopped successfully');
                this.toggleButton.text = 'Lando Start';
                this.toggleButton.command = 'lando.start';
                vscode_1.commands.executeCommand('lando.info-refresh');
                vscode_1.commands.executeCommand('lando.list-refresh');
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
    info(dir) {
        try {
            var stdout = child_process_1.execSync('lando info --format json', {
                cwd: dir,
                encoding: 'utf8'
            });
            return stdout;
        }
        catch (e) {
            if (e
                .toString()
                .includes('Could not find app in this dir or a reasonable amount of directories above it') ||
                e.toString().includes("Cannot set property 'opts' of undefined")) {
                vscode_1.window.showWarningMessage('Please initiate a lando project: ' + e);
                return 'warn: Could not find app in this dir or a reasonable amount of directories about it';
            }
            return 'warn: Could not find app in this dir or a reasonable amount of directories about it';
        }
    }
    list() {
        var stdout = child_process_1.execSync('lando list --format json', { encoding: 'utf8' });
        return stdout;
    }
    config() {
        var stdout = child_process_1.execSync('lando config --format json', { encoding: 'utf8' });
        return stdout;
    }
    version() {
        var stdout = child_process_1.execSync('lando version', { encoding: 'utf8' });
        return stdout;
    }
    poweroff() {
        const child = child_process_1.exec('lando poweroff', { encoding: 'utf8' });
        child.stdout.on('data', data => {
            if (data.includes('Spinning Lando containers down')) {
                vscode_1.window.showInformationMessage('Powering off Lando');
            }
            if (data.includes('Lando containers have been spun down')) {
                vscode_1.window.showInformationMessage('Lando has been powered off started successfully');
                this.toggleButton.text = 'Lando Start';
                this.toggleButton.command = 'lando.start';
                vscode_1.commands.executeCommand('lando.info-refresh');
                vscode_1.commands.executeCommand('lando.list-refresh');
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
exports.Lando = Lando;
//# sourceMappingURL=lando.js.map