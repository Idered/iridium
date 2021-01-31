import * as vscode from "vscode";
import * as t from "@babel/types";
import traverse, { VisitNodeFunction } from "@babel/traverse";
import { parseCode } from "../parse-code";
import { inject, injectable } from "inversify";
import { injects } from "../enums";
import { StoreService } from "./StoreService";

export enum EntityManagerServiceEvents {}

@injectable()
export class EntityManagerService {
  constructor(
    @inject(StoreService) private storeService: StoreService,
    @inject(injects.context) private context: vscode.ExtensionContext
  ) {}

  async watch(glob: string) {
    const watcher = vscode.workspace
      .createFileSystemWatcher(glob)
      .onDidChange(this.handleEntityFileChange);
    this.context.subscriptions.push(watcher);
  }

  handleEntityFileChange() {}

  async findEntities(glob: string) {
    const uris = await vscode.workspace.findFiles(glob);
    // const entities = new Map<string, any>();
    type EntityItem = {
      uri: vscode.Uri;
      loc: t.SourceLocation | null;
      name: string;
      properties: Record<string, any>;
    };
    const entities: EntityItem[] = [];

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
            const entityIndex = entities.findIndex(
              (item) => item.name === entityName
            );
            const propertyName = path.node.key.name;
            entities[entityIndex].properties[propertyName] = {
              name: propertyName,
              // decorators: path.node.decorators,
              key: path.node.key,
              loc: path.node.loc,
              static: path.node.static,
              computed: path.node.computed,
              typeAnnotation: path.node.typeAnnotation,
            };
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
            entities.push({
              uri,
              loc: path.node.loc,
              name: entityName,
              properties: {},
            });
            path.traverse(classPropertyVisitor, { entityName });
          }
        },
      });
    }

    // const arr = [...entities.entries()];
    // arr.sort();
    // const result = arr.reduce((all, [name, value]) => {
    //   return { ...all, [name]: value };
    // }, {});

    entities.sort((a, b) => {
      const fa = a.name.toLowerCase();
      const fb = b.name.toLowerCase();
      return fa < fb ? -1 : fa > fb ? 1 : 0;
    });
    return entities;
  }
}
