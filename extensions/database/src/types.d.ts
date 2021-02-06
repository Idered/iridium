type DatabaseConnection = {
  uuid: string;
  name: string;
  type: "postgres"; // | "mysql";
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

type DatabaseTable = {
  name: string;
};

type DatabaseMutation = {
  newValue: any;
  tableName: any;
  originalValue: any;
  type: MutationType;
  columnName: string;
  primaryColumnValue?: any;
  primaryColumnName?: string;
};
