import { parse } from "@babel/parser";
import traverse, {
  VisitNodeFunction,
  Visitor,
  visitors,
} from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

export function transform(code: string) {
  const ast = parse(code, {
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

  const cache = new Map();

  const classPropertyVisitor: Record<
    string,
    VisitNodeFunction<t.Node, t.ClassProperty>
  > = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ClassProperty(path) {
      const entityName = (this as any).entityName;
      if (t.isIdentifier(path.node.key)) {
        const propertyName = path.node.key.name;
        cache.set(entityName, { ...cache.get(entityName), [propertyName]: {} });
      }
    },
  };

  traverse(ast, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ClassDeclaration(path) {
      if (
        t.isIdentifier(path.node.superClass) &&
        path.node.superClass.name === "BaseEntity"
      ) {
        const entityName = path.node.id.name;
        cache.set(entityName, {});
        path.traverse(classPropertyVisitor, { entityName });
      }
    },
    // ClassProperty(path) {
    //   console.log(path.node);
    // },
  });

  // console.log(...cache.entries());

  // return generate(ast).code;
}

function toArrowFunction(node: t.FunctionDeclaration): t.VariableDeclaration {
  const name = node.id ? node.id.name : "converted";
  const identifier = t.identifier(name);
  const arrowFunctionExpression = t.arrowFunctionExpression(
    node.params,
    node.body,
    node.async
  );
  const declarator = t.variableDeclarator(identifier, arrowFunctionExpression);
  return t.variableDeclaration("const", [declarator]);
}
