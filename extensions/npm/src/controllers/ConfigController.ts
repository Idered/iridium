import { Controller } from "foundation/Routing/Controller";
import { workspace } from "vscode";

export class ConfigController extends Controller {
  async hideSupportIcon() {
    const config = workspace.getConfiguration("iridium.npm");
    config.update("showSupportIcon", false);
  }

  async getConfig() {
    const config = workspace.getConfiguration("iridium.npm");
    return {
      runAudit: config.get("runAudit"),
      showAnalyzeTab: config.get("showAnalyzeTab"),
      showSupportIcon: config.get("showSupportIcon"),
      showResultDescription: config.get("showResultDescription"),
      excludeVersions: config.get("excludeVersions"),
      showAlgoliaInfo: config.get("showAlgoliaInfo"),
      showShortcuts: config.get("showShortcuts"),
      maxNumberOfResults: config.get("maxNumberOfResults"),
      analyze: config.get("analyze"),
    };
  }
}
