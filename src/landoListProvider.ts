import { TreeDataProvider, ExtensionContext, TreeItem, TreeItemCollapsibleState, EventEmitter, Event } from 'vscode';
import { refreshToggleButton } from './extension';
import { list, reformatList } from './lando';
import * as json from 'jsonc-parser';

export class LandoListProvider implements TreeDataProvider<number> {
  private _onDidChangeTreeData: EventEmitter<number | null> = new EventEmitter<number | null>();
  readonly onDidChangeTreeData: Event<number | null> = this._onDidChangeTreeData.event;

  private text: string = '';
  private tree: any = {};

  constructor(context: ExtensionContext) {
    this.parseTree();
  }

  refresh(offset?: number): void {
    console.log('refreshing list');
    this.parseTree();
    if (offset) {
      this._onDidChangeTreeData.fire(offset);
    } else {
      this._onDidChangeTreeData.fire();
    }

    refreshToggleButton();
  }

  private parseTree(): void {
    this.text = reformatList(list());
    if (Object.keys(json.parse(this.text)).length <= 0) this.text = '["No Running Services"]';
    this.tree = json.parseTree(this.text);
  }

  getNode(offset: number): json.Node {
    const path = json.getLocation(this.text, offset).path;
    return json.findNodeAtLocation(this.tree, path);
  }

  getChildren(offset?: number): Thenable<number[]> {
    if (offset) {
      var node = this.getNode(offset);
      return Promise.resolve(this.getChildrenOffsets(node));
    } else {
      return Promise.resolve(this.tree ? this.getChildrenOffsets(this.tree) : []);
    }
  }

  getChildrenOffsets(node: json.Node): number[] {
    const offsets: number[] = [];
    if (node.children) {
      for (const child of node.children) {
        const childNode = this.getNode(child.offset);
        if (childNode) {
          offsets.push(childNode.offset);
        }
      }
    }
    return offsets;
  }

  getTreeItem(offset: number): TreeItem {
    const valueNode = this.getNode(offset);
    if (valueNode) {
      let hasChildren = valueNode.type === 'object' || valueNode.type === 'array';
      let label: string = this.getLabel(valueNode);
      let treeItem: TreeItem = new TreeItem(
        label,
        hasChildren ? (valueNode.type === 'object' ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed) : TreeItemCollapsibleState.None
      );

      if (label.match(/^service_/)) {
        if (label.includes('_global_')) {
          treeItem.contextValue = 'service';
        } else {
          treeItem.contextValue = 'app';
        }
        treeItem.label = treeItem.label ? treeItem.label.replace(/^service_/, '') : treeItem.label;
      } else {
        treeItem.contextValue = valueNode.type;
      }

      // special cases
      if (treeItem.contextValue === 'app' || treeItem.contextValue === 'service') {
        treeItem.collapsibleState = TreeItemCollapsibleState.Collapsed;
      }
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
        if (node.type === 'object') {
          // return '{ } ' + property;
          return property;
        }
        if (node.type === 'array') {
          return '[ ] ' + property;
        }
        const value = node.value;
        return `${property}: ${value}`;
      }
    }
    return '';
  }
}
