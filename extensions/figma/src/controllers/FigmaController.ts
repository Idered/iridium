import { inject, injectable } from "inversify";
import { VSCodeContext } from "foundation/App/VSCodeContext";

@injectable()
export class FigmaController {
  @inject(VSCodeContext) context: VSCodeContext;

  list() {
    return {
      message: "ok",
    };
  }
}
