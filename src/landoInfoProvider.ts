import { TreeDataProvider, ExtensionContext, TreeItem, TreeItemCollapsibleState, EventEmitter, Event } from 'vscode';
import { info, reformatInfo } from './lando';
import * as json from 'jsonc-parser';

export class LandoInfoProvider implements TreeDataProvider<number> {
  private _onDidChangeTreeData: EventEmitter<number | null> = new EventEmitter<number | null>();
  readonly onDidChangeTreeData: Event<number | null> = this._onDidChangeTreeData.event;

  private text: string = '';
  private tree: any = {};
  private workspaceFolderPath: string;

  constructor(context: ExtensionContext, workspaceFolderPath: string) {
    this.workspaceFolderPath = workspaceFolderPath;
    this.parseTree();
  }

  refresh(offset?: number): void {
    this.parseTree();
    if (offset) {
      this._onDidChangeTreeData.fire(offset);
    } else {
      this._onDidChangeTreeData.fire();
    }
  }

  private parseTree(): void {
    // this.text = reformatInfo(info(this.workspaceFolderPath));
    this.text = info(this.workspaceFolderPath);
    this.tree = json.parseTree(this.text);
  }

  getChildren(offset?: number): Thenable<number[]> {
    if (offset) {
      const path = json.getLocation(this.text, offset).path;
      const node = json.findNodeAtLocation(this.tree, path);
      return Promise.resolve(this.getChildrenOffsets(node));
    } else {
      return Promise.resolve(this.tree ? this.getChildrenOffsets(this.tree) : []);
    }
  }

  private getChildrenOffsets(node: json.Node): number[] {
    const offsets: number[] = [];
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

  getTreeItem(offset: number): TreeItem {
    const path = json.getLocation(this.text, offset).path;
    const valueNode = json.findNodeAtLocation(this.tree, path);
    if (valueNode) {
      let hasChildren = valueNode.type === 'object' || valueNode.type === 'array';
      let label = this.getLabel(valueNode);
      let treeItem: TreeItem = new TreeItem(
        label,
        hasChildren
          ? valueNode.type === 'object' || valueNode.type === 'array'
            ? TreeItemCollapsibleState.Expanded
            : TreeItemCollapsibleState.Collapsed
          : TreeItemCollapsibleState.None
      );
      treeItem.contextValue = label.includes('http') ? 'link' : valueNode.type;
      return treeItem;
    }
    return {};
  }

  private getLabel(node: json.Node): string {
    if (node.parent) {
      if (node.parent.type === 'array') {
        let prefix: any = node.parent.children ? node.parent.children.indexOf(node).toString() : '';
        if (node.type === 'object') {
          return prefix + ':{ }';
        }
        if (node.type === 'array') {
          return prefix + ':[ ]';
        }
        return isNaN(prefix) ? prefix + ':' + node.value.toString() : node.value.toString();
      } else {
        const property = node.parent.children ? node.parent.children[0].value.toString() : '';
        if (node.type === 'array' || node.type === 'object') {
          if (node.type === 'object') {
            return '{ } ' + property;
          }
          if (node.type === 'array') {
            return '[ ] ' + property;
          }
        }
        const value = node.value.toString();
        return `${property}: ${value}`;
      }
    }
    return '';
  }
}
