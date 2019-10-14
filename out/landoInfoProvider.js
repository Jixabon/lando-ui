"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const json = require("jsonc-parser");
const lando_1 = require("./lando");
class LandoInfoProvider {
    constructor(context) {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.text = '';
        this.tree = {};
        this.workspaceFolderPath = '';
        this.lando = {};
        this.lando = new lando_1.Lando(context);
        this.workspaceFolderPath = vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.fsPath : '';
        this.parseTree();
        console.log(this.tree);
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
        this.text = this.lando.info(this.workspaceFolderPath);
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
                return isNaN(prefix) ? prefix + ':' + node.value.toString() : node.value.toString();
            }
            else {
                const property = node.parent.children ? node.parent.children[0].value.toString() : '';
                console.log(property);
                if (node.type === 'array' || node.type === 'object') {
                    if (node.type === 'object') {
                        return '{ } ' + property;
                    }
                    if (node.type === 'array') {
                        return '[ ] ' + property;
                    }
                }
                const value = node.value.toString();
                // return isNaN(property) ? `${property}: ${value}` : `${value}`;
                return `${property}: ${value}`;
            }
        }
        return '';
    }
}
exports.LandoInfoProvider = LandoInfoProvider;
//# sourceMappingURL=landoInfoProvider.js.map