"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const json = require("jsonc-parser");
const child_process_1 = require("child_process");
class LandoInfo {
    constructor(context) {
        child_process_1.exec('lando list --format json', { encoding: 'utf8' }, (error, stdout, stderr) => {
            try {
                var list = json.parse(stdout);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    getTreeItem(element) {
        return new vscode_1.TreeItem('Testing');
    }
    getChildren(element) { }
    getParent(element) { }
}
exports.LandoInfo = LandoInfo;
//# sourceMappingURL=jsonOutline.js.map