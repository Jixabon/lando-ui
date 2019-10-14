"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const json = require("jsonc-parser");
const child_process_1 = require("child_process");
class LandoInfo {
    constructor(context) {
        this.text = '';
        this.tree = {};
        this.text = child_process_1.execSync('lando list --format json').toString();
        this.tree = json.parseTree(this.text);
    }
    refresh(offset) {
        console.log('refresh Called');
        this.parseTree();
    }
    parseTree() {
        child_process_1.exec('lando list --format json', (error, stdout, stderr) => {
            this.text = stdout;
            this.tree = json.parseTree(this.text);
        });
    }
    getChildren(offset) {
        if (this.tree == {}) {
            this.parseTree();
        }
        console.log('getChildren Called');
        console.log(this.tree);
        if (offset) {
            const path = json.getLocation(this.text, offset).path;
            const node = json.findNodeAtLocation(this.tree, path);
            return Promise.resolve(this.getChildrenOffsets(node));
        }
        else {
            return Promise.resolve(this.tree ? this.getChildrenOffsets(this.tree) : []);
        }
    }
    getChildrenOffsets(node) {
        console.log('getChildrenOffsets Called');
        console.log(this.tree);
        const offsets = [];
        if (node.children) {
            for (const child of node.children) {
                const childPath = json.getLocation(this.text, child.offset).path;
                const childNode = json.findNodeAtLocation(this.tree, childPath);
                if (childNode) {
                    offsets.push(childNode.offset);
                }
            }
        }
        return offsets;
    }
    getTreeItem(offset) {
        console.log('getTreeItem Called');
        console.log(this.tree);
        const path = json.getLocation(this.text, offset).path;
        const valueNode = json.findNodeAtLocation(this.tree, path);
        if (valueNode) {
            let hasChildren = valueNode.type === 'object' || valueNode.type === 'array';
            let treeItem = new vscode_1.TreeItem(valueNode.value, hasChildren ? (valueNode.type === 'object' ? vscode_1.TreeItemCollapsibleState.Expanded : vscode_1.TreeItemCollapsibleState.Collapsed) : vscode_1.TreeItemCollapsibleState.None);
            treeItem.contextValue = valueNode.type;
            return treeItem;
        }
        return {};
    }
}
exports.LandoInfo = LandoInfo;
//# sourceMappingURL=landoInfo.js.map