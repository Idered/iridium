import { injectVSCode } from "@shared/helpers/inject-vscode";
import { Actions } from "@/enums";

export function useVSCode() {
  return injectVSCode<Actions>();
}
