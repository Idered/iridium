/* eslint-disable @typescript-eslint/naming-convention */
export enum Actions {
  getEntities = "GET_ENTITIES",
  goto = "GOTO",
  openURL = "OPEN_URL",

  getConfig = "GET_CONFIG",

  getConnection = "GET_CONNECTION",
  getConnections = "GET_CONNECTIONS",
  createConnection = "CREATE_CONNECTION",
  updateConnection = "UPDATE_CONNECTION",
  deleteConnection = "DELETE_CONNECTION",
  testConnection = "TEST_CONNECTION",

  getTables = "GET_TABLES",
  getTableColumns = "GET_TABLE_COLUMNS",
  getTableRows = "GET_TABLE_ROWS",
}

export enum DatabaseDriver {
  // "MySQL" = "mysql",
  "PostgreSQL" = "postgres",
}

export enum DatabaseFilterOperator {
  EQUAL = "=",
  NOT_EQUAL = "<>",
  LESS_THAN = "<",
  GREATER_THAN = ">",
  LESS_OR_EQUAL = "<=",
  GREATER_OR_EQUAL = ">=",
  IN = "IN",
  NOT_IN = "NOT IN",
  IS_NULL = "IS NULL",
  IS_NOT_NULL = "IS NOT NULL",
  // BETWEEN = "BETWEEN",
  // NOT_BETWEEN = "NOT BETWEEN",
  // CONTAINS = "CONTAINS",
  // NOT_CONTAINS = "NOT CONTAINS",
  // ICONTAINS = "CONTAINS",
  // INOT_CONTAINS = "NOT CONTAINS",
}
