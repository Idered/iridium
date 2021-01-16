import { parse } from "@babel/parser";

export function parseCode(code: string) {
  return parse(code, {
    sourceType: "module",
    plugins: [
      "optionalChaining",
      "classProperties",
      "decorators-legacy",
      "exportDefaultFrom",
      "doExpressions",
      "numericSeparator",
      "dynamicImport",
      "jsx",
      "typescript",
    ],
  });
}
