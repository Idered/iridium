export enum Actions {
  getEntities = "GET_ENTITIES",
  goto = "GOTO",
  openURL = "OPEN_URL",
  query = "QUERY",

  getConfig = "GET_CONFIG",

  getConnection = "GET_CONNECTION",
  getConnections = "GET_CONNECTIONS",
  createConnection = "CREATE_CONNECTION",
  updateConnection = "UPDATE_CONNECTION",
  deleteConnection = "DELETE_CONNECTION",

  getTables = "GET_TABLES",
  getTableColumns = "GET_TABLE_COLUMNS",
  getTableRows = "GET_TABLE_ROWS",
}

export const injects = {
  context: Symbol.for("context"),
  emitter: Symbol.for("emitter"),
};
