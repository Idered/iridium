import { Controller } from "foundation/Routing/Controller";
import { workspace } from "vscode";

export class ConfigController extends Controller {
  async getConfig() {
    const config = workspace.getConfiguration("iridium.npm");
    return {
      showAnalyzeTab: config.get("showAnalyzeTab"),
      showProTab: config.get("showProTab"),
      showResultDescription: config.get("showResultDescription"),
      excludeVersions: config.get("excludeVersions"),
      showAlgoliaInfo: config.get("showAlgoliaInfo"),
      showShortcuts: config.get("showShortcuts"),
      maxNumberOfResults: config.get("maxNumberOfResults"),
      analyze: config.get("analyze"),
    };
  }
}
