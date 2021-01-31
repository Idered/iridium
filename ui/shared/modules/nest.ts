import { Actions, DatabaseDriver } from "@/enums";
import { useVSCode } from "@/helpers/use-vscode";
import { ref } from "vue";

type NestConfig = {
  orm: {
    name: string;
    type: DatabaseDriver;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
};

const config = ref<null | NestConfig>(null);

export function useNest() {
  const vscode = useVSCode();

  const loadConfig = async () => {
    try {
      config.value = await vscode.fetch({ type: Actions.getConfig });
    } catch (err) {}
  };

  return { config, loadConfig };
}
