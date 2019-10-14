"use strict";
// import * as vscode from 'vscode';
// export class TestView {
//   constructor(context: vscode.ExtensionContext) {
//     const view = vscode.window.createTreeView('lando-ui', { treeDataProvider: aNodeWithIdTreeDataProvider() });
//   }
// }
// const tree = {
//   a: {
//     aa: {
//       aaa: {
//         aaaa: {
//           aaaaa: {
//             aaaaaa: {}
//           }
//         }
//       }
//     },
//     ab: {}
//   },
//   b: {
//     ba: {},
//     bb: {}
//   }
// };
// let nodes = {};
// function aNodeWithIdTreeDataProvider(): vscode.TreeDataProvider<{ key: string }> {
//   return {
//     getChildren: (element: { key: string }): { key: string }[] => {
//       return getChildren(element ? element.key : '').map(key => getNode(key));
//     },
//     getTreeItem: (element: { key: string }): vscode.TreeItem => {
//       const treeItem = getTreeItem(element.key);
//       treeItem.id = element.key;
//       return treeItem;
//     },
//     getParent: ({ key }: { key: string }): { key: string } => {
//       const parentKey = key.substring(0, key.length - 1);
//       return parentKey ? new Key(parentKey) : void 0;
//     }
//   };
// }
//# sourceMappingURL=testView.js.map