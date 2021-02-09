import { FigmaController } from "./controllers/FigmaController";
import { TeamController } from "./controllers/TeamController";
import { Router } from "./foundation/Routing/Router";

export default (router: Router) => {
  router.post("/teams", [TeamController, "create"]);
  router.post("/figma", [FigmaController, "list"]);
};
