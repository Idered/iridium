import { Actions } from "@/enums";
import { useVSCode } from "@/utils/use-vscode";
import {
  DatabaseConnection,
  DatabaseFilter,
  DatabaseTableColumn,
} from "@/types";
import { toRefs, reactive, inject } from "vue";

type State = {
  connections: DatabaseConnection[];
  connection: DatabaseConnection | null;
  tables: string[];
  table: string | null;
  visibleColumns: string[];
  columns: DatabaseTableColumn[];
  rows: Record<string, any>[];
  filters: DatabaseFilter[];
  order: {
    column: string;
    direction: "asc" | "desc";
  } | null;
  pagination: {
    total: number;
    perPage: number;
    page: number;
  };
};

const stateSymbol = Symbol("DatabaseState");

export const createDatabaseState = (): [Symbol, State] => {
  const state = reactive<State>({
    connections: [],
    connection: null,
    tables: [],
    table: null,
    visibleColumns: [],
    columns: [],
    rows: [],
    filters: [],
    order: null,
    pagination: {
      total: 0,
      perPage: 0,
      page: 0,
    },
  });
  return [stateSymbol, state];
};

export function useDatabase() {
  const vscode = useVSCode();
  const state = inject<State>(stateSymbol)!;

  // Methods
  const clearState = () => {
    state.columns = [];
    // state.connection = null;
    // state.connections = [];
    state.table = null;
    state.tables = [];
    state.columns = [];
    state.rows = [];
    state.filters = [];
  };

  const toggleColumnOrder = (column: string) => {
    switch (true) {
      case state.order?.direction === undefined ||
        state.order?.column !== column:
        state.order = { column, direction: "asc" };
        break;
      case state.order?.direction === "asc":
        state.order = {
          column,
          direction: state.order?.column === column ? "desc" : "asc",
        };
        break;
      case state.order?.direction === "desc":
        state.order = null;
    }
  };

  const resetOrder = () => {
    state.order = null;
  };

  const setVisibleColumns = (columns: string[]) => {
    state.visibleColumns = columns;
  };

  const setColumns = (columns: DatabaseTableColumn[]) => {
    state.columns = columns;
  };

  const setRows = (rows: any[]) => {
    if (rows.length === 0) {
      state.pagination = {
        page: 0,
        perPage: 0,
        total: 0,
      };
    }
    state.rows = rows;
  };

  const getConnections = async () => {
    state.connections = await vscode.fetch<any[]>({
      type: Actions.getConnections,
    });
    return state.connections;
  };

  const getTables = async (connectionUUID: string) => {
    state.tables = await vscode.fetch<string[]>({
      type: Actions.getTables,
      payload: { connection: connectionUUID },
    });
    return state.tables;
  };

  const selectConnection = (connectionUUID: string) => {
    state.connection =
      state.connections.find((item) => item.uuid === connectionUUID) || null;
  };

  const selectTable = (tableName: string) => {
    state.rows = [];
    state.columns = [];
    state.table = state.tables.find((item) => item === tableName) || null;
  };

  const getTableColumns = async (tableName: string) => {
    state.columns = await vscode.fetch<DatabaseTableColumn[]>({
      type: Actions.getTableColumns,
      payload: {
        tableName,
        connection: state.connection?.uuid,
      },
    });

    return state.columns;
  };

  const getTableRows = async (
    tableName: string,
    options?: { page: number; limit?: number }
  ) => {
    const { page, limit } = { page: 0, ...options };
    const res = await vscode.fetch<{
      perPage: number;
      page: number;
      total: number;
      data: any[];
    }>({
      type: Actions.getTableRows,
      payload: {
        tableName,
        page,
        limit,
        filters: state.filters,
        order: state.order,
        connection: state.connection?.uuid,
      },
    });

    state.pagination = {
      total: res.total,
      page: res.page,
      perPage: res.perPage,
    };

    if (page === 0) {
      state.rows = res.data;
    } else {
      state.rows = ([] as any[]).concat(state.rows, res.data);
    }

    return state.rows;
  };

  const createConnection = async (
    connection: Omit<DatabaseConnection, "uuid">
  ) => {
    const newConnection = await vscode.fetch<DatabaseConnection>({
      type: Actions.createConnection,
      payload: {
        name: connection.name,
        type: connection.type,
        host: connection.host,
        port: connection.port,
        username: connection.username,
        password: connection.password,
        database: connection.database,
      },
    });

    state.connections.push(newConnection);

    return newConnection;
  };

  const updateConnection = async (connection: Partial<DatabaseConnection>) => {
    const updatedConnection = await vscode.fetch<DatabaseConnection>({
      type: Actions.updateConnection,
      payload: {
        uuid: connection.uuid,
        name: connection.name,
        type: connection.type,
        host: connection.host,
        port: connection.port,
        username: connection.username,
        password: connection.password,
        database: connection.database,
      },
    });

    const index = state.connections.findIndex(
      (item) => item.uuid === connection.uuid
    );
    state.connections.splice(index, 1);
    state.connections.splice(index, 0, updatedConnection);

    return updatedConnection;
  };

  const deleteConnection = async (connectionUUID?: string) => {
    if (!connectionUUID) {
      return;
    }
    await vscode.fetch<DatabaseConnection>({
      type: Actions.deleteConnection,
      payload: {
        uuid: connectionUUID,
      },
    });
    const index = state.connections.findIndex(
      (item) => item.uuid === connectionUUID
    );
    state.connections.splice(index, 1);
  };

  const loadMore = () => {
    if (state.table) {
      getTableRows(state.table, { page: state.pagination.page + 1 });
    }
  };

  const refresh = async () => {
    if (!state.connection?.uuid) {
      return;
    }
    await getTables(state.connection?.uuid);
    if (!state.table) {
      return;
    }
    await getTableColumns(state.table);
    await getTableRows(state.table, {
      page: 0,
      limit: (state.pagination.page + 1) * state.pagination.perPage,
    });
  };

  const addFilter = (filter: DatabaseFilter) => {
    state.filters.push(filter);
  };

  const removeFilter = (filter: DatabaseFilter) => {
    state.filters = state.filters.filter((item) => item.uuid !== filter.uuid);
  };

  const resetFilters = () => {
    state.filters = [];
  };

  return {
    addFilter,
    removeFilter,
    resetFilters,
    //
    clearState,
    loadMore,
    toggleColumnOrder,
    setVisibleColumns,
    resetOrder,
    refresh,
    // Connection
    getConnections,
    selectConnection,
    createConnection,
    updateConnection,
    deleteConnection,
    // Table
    getTables,
    getTableColumns,
    getTableRows,
    setColumns,
    setRows,
    selectTable,
    ...toRefs(state),
  };
}
