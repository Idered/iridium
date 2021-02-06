import { Actions } from "@/enums";
import { DatabaseConnection, DatabaseMutation, MutationType } from "@/types";
import { useVSCode } from "@/utils/use-vscode";
import { inject, reactive, toRefs } from "vue";

type State = {
  mutations: DatabaseMutation[];
};

const stateSymbol = Symbol("DatabaseMutationsState");

export const createDatabaseMutationsState = (): [Symbol, State] => {
  const state = reactive<State>({
    mutations: [],
  });
  return [stateSymbol, state];
};

export function useDatabaseMutations() {
  const vscode = useVSCode();
  const state = inject<State>(stateSymbol)!;

  const createMutation = (
    table: string | null,
    row: Record<string, any>,
    mutation: DatabaseMutation
  ) => {
    if (!table) {
      return;
    }
    const index = state.mutations.findIndex((item) => {
      const isMatchedByPrimaryColumn =
        item.primaryColumnName &&
        row[item.primaryColumnName] === item.primaryColumnValue;
      const isMatchedByColumnName =
        !item.primaryColumnName && item.columnName === mutation.columnName;
      return (
        item.tableName === table &&
        item.columnName === mutation.columnName &&
        item.type === MutationType.UpdateColumn &&
        (isMatchedByPrimaryColumn || isMatchedByColumnName)
      );
    });
    if (index >= 0) {
      state.mutations.splice(index, 1, mutation);
    } else {
      state.mutations.push(mutation);
    }
  };
  const commitMutations = async (connection: DatabaseConnection | null) => {
    if (!connection) {
      return;
    }
    await vscode.fetch({
      type: Actions.commitMutations,
      payload: {
        connection: connection.uuid,
        mutations: state.mutations,
      },
    });
  };
  const discardMutations = () => {
    state.mutations = [];
  };
  return {
    ...toRefs(state),
    createMutation,
    commitMutations,
    discardMutations,
  };
}
