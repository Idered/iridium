import { DatabaseDriver } from "@/enums";
import { reactive, toRefs } from "vue";

export function useConnectionModel() {
  const connection = reactive({
    name: "",
    type: null as { value: DatabaseDriver; label: string } | null,
    host: "localhost",
    username: "",
    password: "",
    database: "",
    port: null as number | null,
  });
  const serialize = () => ({
    name: connection.name.trim(),
    type: connection.type?.value!,
    host: connection.host.trim() || "localhost",
    port: connection.port!,
    username: connection.username.trim(),
    password: connection.password.trim(),
    database: connection.database.trim(),
  });
  return { ...toRefs(connection), serialize };
}
