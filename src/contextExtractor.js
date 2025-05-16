// contextExtractor.js
import { parse } from "@babel/parser";
import babelTraverse from "@babel/traverse";
const traverse = babelTraverse.default || babelTraverse;

/**
 * Extrae un mapa jerárquico de contextos desde código fuente
 * incluyendo funciones, hooks, try/catch, return y JSX.
 * @param {string} sourceCode
 * @returns {Object} contextMap - { [id]: { id, type, code, loc, parentId, children, changes } }
 */
export function extractContextMapFromCode(sourceCode, filename) {
  try {
    const ast = parse(sourceCode, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
    const contextMap = new Map();

    const isContextNode = (path) => {
      const { node } = path;
      const isHookCall =
        path.isCallExpression() &&
        node.callee.type === "Identifier" &&
        /^use[A-Z]/.test(node.callee.name);

      return (
        path.isFunctionDeclaration() ||
        path.isFunctionExpression() ||
        path.isArrowFunctionExpression() ||
        path.isReturnStatement() ||
        path.isTryStatement() ||
        path.isJSXElement() ||
        isHookCall
      );
    };

    const generateId = (path) => {
      const { node } = path;
      if (path.isFunctionDeclaration())
        return node.id?.name || `anonFn@${node.start}`;
      if (path.isVariableDeclarator())
        return node.id?.name || `anonVar@${node.start}`;
      if (path.isReturnStatement())
        return `return@${node.loc.start.line}:${node.loc.start.column}`;
      if (path.isTryStatement())
        return `try@${node.loc.start.line}:${node.loc.start.column}`;
      if (path.isJSXElement()) {
        const name = node.openingElement.name.name || "JSX";
        return `<${name}>@${node.loc.start.line}:${node.loc.start.column}`;
      }
      if (path.isCallExpression())
        return `${node.callee.name}@${node.loc.start.line}:${node.loc.start.column}`;
      return `ctx@${node.start}`;
    };

    traverse(ast, {
      enter(path) {
        if (!isContextNode(path)) return;

        const id = generateId(path);
        const code = sourceCode.slice(path.node.start, path.node.end);
        const loc = path.node.loc;

        const parentPath = path.findParent(isContextNode);
        const parentId = parentPath ? generateId(parentPath) : null;

        const context = {
          id,
          type: path.type,
          loc: { ...loc, filename },
          code,
          parentId,
          children: [],
          changes: [],
        };

        contextMap.set(id, context);

        if (parentId) {
          if (!contextMap.has(parentId)) {
            contextMap.set(parentId, {
              id: parentId,
              type: "unknown",
              loc: parentPath.node.loc,
              code: sourceCode.slice(
                parentPath.node.start,
                parentPath.node.end
              ),
              parentId: null,
              children: [],
              changes: [],
            });
          }
          contextMap.get(parentId).children.push(id);
        }
      },
    });

    return Object.fromEntries(contextMap);
  } catch (err) {
    console.error(`❌ Error parseando ${filename || "archivo"}:`, err.message);
    return {};
  }
}
