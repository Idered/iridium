/* eslint-disable @typescript-eslint/naming-convention */
import { DatabaseDriver, DatabaseFilterOperator } from "@/enums";

export type DatabaseConnection = {
  uuid: string;
  name: string;
  type: DatabaseDriver;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type DatabaseTable = {
  name: string;
};

export type DatabaseTableColumn = {
  comment: null | string;
  default_value: null | string | boolean | number;
  foreign_key_column: null | string;
  foreign_key_schema: null | string;
  foreign_key_table: null | string;
  has_auto_increment: boolean;
  is_nullable: boolean;
  is_primary_key: boolean;
  max_length: null | number;
  name: string;
  precision: null | number;
  scale: null | number;
  schema: string;
  table: string;
  type: string;
};

export type DatabaseFilter = {
  uuid: string;
  active: boolean;
  column: string;
  operator: DatabaseFilterOperator;
  value: string;
};

export enum MutationType {
  UpdateColumn,
  RemoveRow,
}

export type DatabaseMutation = {
  newValue: any;
  tableName: any;
  originalValue: any;
  type: MutationType;
  columnName: string;
  primaryColumnValue?: any;
  primaryColumnName?: string;
};
