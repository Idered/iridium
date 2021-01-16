import * as vscode from "vscode";
import { WebviewProvider } from "./webview-provider";
import * as t from "@babel/types";
import traverse, { VisitNodeFunction } from "@babel/traverse";
import { parseCode } from "./parse-code";

class Iridium {
  constructor(private readonly context: vscode.ExtensionContext) {}

  registerWebview(provider: vscode.WebviewViewProvider) {
    const subscription = vscode.window.registerWebviewViewProvider(
      WebviewProvider.viewId,
      provider
    );
    this.context.subscriptions.push(subscription);
  }
}

class Entity {}

class EntityManager {
  private entities: Entity[] = [];

  constructor(private readonly context: vscode.ExtensionContext) {}

  async watch(glob: string) {
    const uris = await vscode.workspace.findFiles(glob);
    this.registerEntities(uris);
    const watcher = vscode.workspace
      .createFileSystemWatcher("**/*.entity.ts")
      .onDidChange(this.handleEntityFileChange);
    this.context.subscriptions.push(watcher);
  }

  handleEntityFileChange() {}

  async registerEntities(uris: vscode.Uri[]) {
    const cache = new Map();

    for (const uri of uris) {
      const file = await vscode.workspace.fs.readFile(uri);
      const code = file.toString();
      const ast = parseCode(code);
      const classPropertyVisitor: Record<
        string,
        VisitNodeFunction<t.Node, t.ClassProperty>
      > = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ClassProperty(path) {
          const entityName = (this as any).entityName;
          if (t.isIdentifier(path.node.key)) {
            const propertyName = path.node.key.name;
            cache.set(entityName, {
              ...cache.get(entityName),
              [propertyName]: {
                decorators: path.node.decorators,
                loc: path.node.loc,
                static: path.node.static,
                computed: path.node.computed,
                typeAnnotation: path.node.typeAnnotation,
              },
            });
          }
        },
      };

      traverse(ast, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ClassDeclaration(path) {
          if (
            t.isIdentifier(path.node.superClass) &&
            path.node.superClass.name === "BaseEntity"
          ) {
            const entityName = path.node.id.name;
            cache.set(entityName, {});
            path.traverse(classPropertyVisitor, { entityName });
          }
        },
      });
    }

    // console.log({
    //   entries: [...cache.entries()],
    // });
  }
}

export function activate(context: vscode.ExtensionContext) {
  const iridium = new Iridium(context);
  const webviewProvider = new WebviewProvider(context);
  const entityManager = new EntityManager(context);

  vscode.window.activeColorTheme;

  iridium.registerWebview(webviewProvider);
  entityManager.watch("**/*.entity.ts");
}

export function deactivate() {}
