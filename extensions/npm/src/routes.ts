import { PackageJsonController } from "./controllers/PackageJsonController";
import { Router } from "foundation/Routing/Router";
import { ConfigController } from "./controllers/ConfigController";

export default (router: Router) => {
  router.get("/package-json-files", [
    PackageJsonController,
    "getPackageJSONFiles",
  ]);
  router.post("/update-confirmation", [
    PackageJsonController,
    "showUpdateConfirmation",
  ]);
  router.post("/installed", [PackageJsonController, "getInstalledPackages"]);
  router.post("/install", [PackageJsonController, "installPackages"]);
  router.post("/remove", [PackageJsonController, "removePackage"]);
  router.post("/swap", [PackageJsonController, "swapPackageType"]);
  router.post("/change-version", [PackageJsonController, "changeVersion"]);
  router.post("/update", [PackageJsonController, "updatePackages"]);
  router.get("/config", [ConfigController, "getConfig"]);
};
