import { Controller } from "../foundation/Routing/Controller";

export class TeamController extends Controller {
  create() {
    console.log("team/create");
    return {
      message: "ok",
    };
  }
}
