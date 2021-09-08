import { injectable, inject } from "inversify";
import { VSCodeContext } from "../App/VSCodeContext";

@injectable()
export class Controller {
  @inject(VSCodeContext) public context: VSCodeContext;
}
