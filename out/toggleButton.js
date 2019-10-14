"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class ToggleButton {
    constructor(context) {
        this.statusBarItem = {};
        this.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 3);
        this.statusBarItem.text = 'Loading...';
        this.statusBarItem.command = '';
        return this.statusBarItem;
    }
    setText(label) {
        this.statusBarItem.text = label;
    }
    setCommand(command) {
        this.statusBarItem.command = command;
    }
    getStatusBarItem() {
        return this.statusBarItem;
    }
}
exports.ToggleButton = ToggleButton;
//# sourceMappingURL=toggleButton.js.map