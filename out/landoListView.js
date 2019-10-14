"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const json = require("jsonc-parser");
const child_process_1 = require("child_process");
class LandoListView {
    constructor(context) {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.text = '';
        this.tree = {};
        this.parseTree();
    }
    refresh(offset) {
        this.parseTree();
        if (offset) {
            this._onDidChangeTreeData.fire(offset);
        }
        else {
            this._onDidChangeTreeData.fire();
        }
    }
    parseTree() {
        this.text = child_process_1.execSync('lando list --format json').toString();
        this.tree = json.parseTree(this.text);
    }
    getChildren(offset) {
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
        const path = json.getLocation(this.text, offset).path;
        const valueNode = json.findNodeAtLocation(this.tree, path);
        if (valueNode) {
            let hasChildren = valueNode.type === 'object' || valueNode.type === 'array';
            let treeItem = new vscode_1.TreeItem(this.getLabel(valueNode), hasChildren ? (valueNode.type === 'object' ? vscode_1.TreeItemCollapsibleState.Expanded : vscode_1.TreeItemCollapsibleState.Collapsed) : vscode_1.TreeItemCollapsibleState.None);
            treeItem.contextValue = valueNode.type;
            return treeItem;
        }
        return {};
    }
    getLabel(node) {
        if (node.parent) {
            if (node.parent.type === 'array') {
                let prefix = node.parent.children ? node.parent.children.indexOf(node).toString() : '';
                if (node.type === 'object') {
                    return prefix + ':{ }';
                }
                if (node.type === 'array') {
                    return prefix + ':[ ]';
                }
                return prefix + ':' + node.value.toString();
            }
            else {
                const property = node.parent.children ? node.parent.children[0].value.toString() : '';
                if (node.type === 'array' || node.type === 'object') {
                    if (node.type === 'object') {
                        return '{ } ' + property;
                    }
                    if (node.type === 'array') {
                        return '[ ] ' + property;
                    }
                }
                const value = node.value;
                return `${property}: ${value}`;
            }
        }
        return '';
    }
}
exports.LandoListView = LandoListView;
//# sourceMappingURL=landoListView.js.map