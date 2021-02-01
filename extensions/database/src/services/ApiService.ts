import * as vscode from "vscode";
import { inject, injectable } from "inversify";
import { Actions, injects } from "../enums";
import { EntityManagerService } from "./EntityManagerService";
import axios from "axios";
import { v4 } from "uuid";
import * as knex from "knex";
import schemaInspector from "knex-schema-inspector";
import { table } from "console";

@injectable()
export class ApiService implements Record<Actions, (payload?: any) => any> {
  constructor(
    @inject(injects.context)
    private context: vscode.ExtensionContext,
    @inject(EntityManagerService)
    private entityManagerService: EntityManagerService
  ) {}

  async [Actions.createConnection](payload: DatabaseConnection) {
    const state = this.context.workspaceState.get<DatabaseConnection[]>(
      "connections"
    );
    const newConnection = {
      ...payload,
      name: payload.name || "Untitled",
      uuid: v4(),
    };
    const newState = [...state!, newConnection];
    this.context.workspaceState.update("connections", newState);
    return newConnection;
  }

  async [Actions.updateConnection](payload: DatabaseConnection) {
    const state = this.context.workspaceState.get<DatabaseConnection[]>(
      "connections"
    );
    if (!state) {
      return;
    }
    const index = state.findIndex((item) => item.uuid === payload.uuid);
    state.splice(index, 1);
    state.splice(index, 0, payload);
    this.context.workspaceState.update("connections", state);
    return payload;
  }

  async [Actions.deleteConnection](payload: { uuid: string }) {
    const state = this.context.workspaceState.get<DatabaseConnection[]>(
      "connections"
    );
    if (!state) {
      return;
    }
    const index = state.findIndex((item) => item.uuid === payload.uuid);
    state.splice(index, 1);
    this.context.workspaceState.update("connections", state);
    return payload;
  }

  async [Actions.getConnections]() {
    return this.context.workspaceState.get<DatabaseConnection[]>("connections");
  }

  async [Actions.getConnection](payload: { uuid: string }) {
    const connections = this.context.workspaceState.get<DatabaseConnection[]>(
      "connections"
    );

    return connections?.find(
      (item) => item.uuid === payload.uuid
    ) as DatabaseConnection | null;
  }

  // getSchemaInspector(db: knex, connection) {
  //   db.client.constructor.name =
  //   const inspector = schemaInspector(db);
  // }

  async [Actions.getTables](payload: { connection: string }) {
    const connection = await this[Actions.getConnection]({
      uuid: payload.connection,
    });
    if (!connection) {
      return [];
    }
    console.log({ connection });
    const db = await this.getDbClient(connection);
    console.log({ db });
    const inspector = schemaInspector(db);
    console.log({ inspector });
    const tables = await inspector.tables();
    console.log({ tables });
    db.destroy();
    tables.sort();
    return tables;
  }

  async [Actions.getTableColumns](payload: {
    tableName: string;
    connection: string;
  }) {
    const connection = await this[Actions.getConnection]({
      uuid: payload.connection,
    });
    if (!connection) {
      return [];
    }
    const db = await this.getDbClient(connection);
    const inspector = schemaInspector(db);
    const columnInfo = await inspector.columnInfo(payload.tableName);
    db.destroy();
    return columnInfo;
  }

  async [Actions.getTableRows](payload: {
    tableName: string;
    connection: string;
    page: number;
    limit: number;
    filters: {
      uuid: string;
      column: string;
      operator: string;
      value: string;
    }[];
    order: {
      column: string;
      direction: "asc" | "desc";
    } | null;
  }) {
    const connection = await this[Actions.getConnection]({
      uuid: payload.connection,
    });
    if (!connection) {
      return [];
    }
    const LIMIT = 50;
    const client = await this.getDbClient(connection);
    let query = client
      .select()
      .from(payload.tableName)
      .offset(LIMIT * payload.page)
      .limit(payload.limit || LIMIT);
    if (payload.order) {
      query.orderBy(payload.order.column, payload.order.direction);
    } else {
      const inspector = schemaInspector(client);
      const columns = await inspector.columnInfo(payload.tableName);
      const primary = columns.find((item) => item.is_primary_key);
      if (primary) {
        query.orderBy(primary.name, "asc");
      }
    }
    for (const filter of payload.filters) {
      switch (filter.operator) {
        case "IN":
          query.whereIn(filter.column, filter.value.split(","));
          break;
        case "NOT IN":
          query.whereNotIn(filter.column, filter.value.split(","));
          break;
        case "IS NULL":
          query.whereNull(filter.column);
          break;
        case "IS NOT NULL":
          query.whereNotNull(filter.column);
          break;
        default:
          let value: any = filter.value;
          try {
            const maybeNumber = Number(filter.value);
            if (!Number.isNaN(maybeNumber)) {
              value = maybeNumber;
            }
          } catch (err) {}
          query.where(filter.column, filter.operator, value);
      }
    }
    const data = await query;
    const [counter] = await client.select().from(payload.tableName).count();
    client.destroy();
    return {
      page: payload.limit
        ? Math.floor(payload.limit / LIMIT) - 1
        : payload.page,
      perPage: LIMIT,
      total: Number(counter.count),
      data,
    };
  }

  async [Actions.getConfig]() {
    // TODO: Make url configurable
    const NEST_URL = "http://localhost:4000/iridium/config";

    try {
      const config = await axios.get(NEST_URL, {
        timeout: 1000,
      });
      return config.data;
    } catch (err) {
      return {};
    }
  }

  async [Actions.getEntities]() {
    return this.entityManagerService.findEntities("**/*.entity.ts");
  }

  [Actions.goto](payload: {
    loc: {
      start: { line: number; column: number };
      end: { line: number; column: number };
    };
    select: boolean;
    uri: vscode.Uri;
  }) {
    const { loc, select = false } = payload;
    const uri = vscode.Uri.parse(payload.uri.path);
    let selection: vscode.Range;
    if (loc) {
      const start = new vscode.Position(loc.start.line - 1, loc.start.column);
      const end = new vscode.Position(loc.end.line - 1, loc.end.column);
      selection = new vscode.Range(start, select ? end : start);
    }
    vscode.workspace.openTextDocument(uri).then((doc) => {
      vscode.window.showTextDocument(doc, { selection });
    });
  }

  [Actions.openURL](payload: { title: string; url: string }) {
    const panel = vscode.window.createWebviewPanel(
      "iridium",
      payload.title,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );
    panel.webview.html = getRemoteWindowContent(payload.title, payload.url);
  }

  async [Actions.query](args: { type: "schema" | "table"; name?: string }) {
    // const inspector = await this.getInspector();
    // switch (args.type) {
    //   case "schema":
    //     const tables = await inspector.tables();
    //     return tables.map((item: any) => ({
    //       name: item,
    //     }));
    //   case "table":
    //     return await inspector.columns(args.name!);
    // }
    // return [];
  }

  private async getDbClient(connection: DatabaseConnection) {
    const db = knex({
      client: connection.type,
      connection: {
        host: connection.host,
        port: connection.port,
        user: connection.username,
        password: connection.password,
        database: connection.database,
      },
    });
    return db;
  }
}

function getRemoteWindowContent(title: string, url: string) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        html {
          background: #fafbfc;
        }
        body {
          padding: 0;
        }
        iframe {
          border: 0;
          width: 100vw;
          height: 100vh;
        }
      </style>
  </head>
  <body>
      <iframe src="${url}"></iframe>
  </body>
  </html>`;
}
