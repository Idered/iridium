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
