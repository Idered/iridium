import { Router } from "foundation/Routing/Router";
import { ConfigController } from "./controllers/ConfigController";
import { VercelController } from "./controllers/VercelController";

export default (router: Router) => {
  router.get("/config", [ConfigController, "getConfig"]);
  router.post("/secrets", [ConfigController, "setSecret"]);
  router.get("/directories", [ConfigController, "getDirectories"]);

  // Vercel
  router.get("/vercel/projects/{id}/deployments", [
    VercelController,
    "getDeployments",
  ]);
  router.get("/vercel/projects", [VercelController, "getProjects"]);
  router.post("/vercel/deploy", [VercelController, "deploy"]);
};
