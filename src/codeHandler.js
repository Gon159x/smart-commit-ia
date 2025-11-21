import fs from "fs-extra";
import path from "path";

import { parse } from "@babel/parser";
import babelTraverse from "@babel/traverse";
const traverse = babelTraverse.default || babelTraverse;

const binaryExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".bmp",
  ".tiff",
  ".avif",
  ".svg",
  ".ico",
  ".psd",
  ".ai",
  ".sketch",
  ".fig",
  ".mp3",
  ".wav",
  ".flac",
  ".ogg",
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".webm",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".odt",
  ".ods",
  ".zip",
  ".tar",
  ".gz",
  ".bz2",
  ".xz",
  ".7z",
  ".rar",
  ".iso",
  ".dmg",
  ".ttf",
  ".otf",
  ".woff",
  ".woff2",
  ".eot",
  ".wasm",
  ".bin",
  ".exe",
  ".dll",
]);

function isBinaryPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return binaryExtensions.has(ext);
}

function isBinaryDiffBlock(block) {
  return (
    /GIT binary patch/i.test(block) ||
    /Binary files .* differ/i.test(block) ||
    /\nbinary mode /i.test(block)
  );
}

export function splitDiffByFile(diffText) {
  const rawBlocks = diffText.split(/^diff --git /gm).filter(Boolean);

  return rawBlocks
    .map((block) => "diff --git " + block)
    .map((block) => {
      // Detectar renombre explícito
      const renameToMatch = block.match(/^rename to (.+)$/m);
      let filePath;

      if (renameToMatch) {
        filePath = renameToMatch[1];
      } else {
        const match = block.match(/^diff --git a\/.+? b\/(.+)/);
        filePath = match?.[1] || "archivo_desconocido";
      }

      const wasDeleted = /--- a\/.+\n\+\+\+ \/dev\/null/.test(block);
      const isNewFile = /--- \/dev\/null\n\+\+\+ b\//.test(block);
      const renameFromMatch = block.match(/^rename from (.+)$/m);
      const lineCount = block.split(/\r?\n/).length;
      const hasBinaryMarker = isBinaryDiffBlock(block);

      return {
        filePath,
        block,
        wasDeleted,
        isNewFile,
        isBinary: hasBinaryMarker || isBinaryPath(filePath),
        renameFrom: renameFromMatch?.[1],
        renameTo: renameToMatch?.[1],
        lineCount,
      };
    })
    .filter(({ filePath }) => {
      return !(
        filePath.startsWith("node_modules/") ||
        filePath === "CHANGELOG.md" ||
        filePath.startsWith(".git/") ||
        filePath.startsWith("dist/") ||
        filePath.startsWith("build/") ||
        filePath.endsWith("package-lock.json") ||
        filePath.endsWith("pnpm-lock.yaml") ||
        filePath.endsWith("yarn.lock")
      );
    });
}

export function splitDiffIntoChunks(diff) {
  return diff
    .split(/^@@/gm)
    .filter(Boolean)
    .map((chunk) => `@@${chunk}`);
}

const patterns = [
  { regex: /function\s+([A-Z_a-z]\w*)/, group: 1 },
  { regex: /(const|let|var)\s+([A-Z_a-z]\w*)\s*=\s*(async\s*)?\(?/, group: 2 },
  { regex: /export\s+(?:const|function)\s+([A-Z_a-z]\w*)/, group: 1 },
  { regex: /class\s+([A-Z_a-z]\w*)/, group: 1 },
];

export function extractFunctionNamesFromDiff(diff) {
  const lines = diff.split("\n");

  // ✅ Incluimos líneas de contexto también
  const candidates = lines
    .filter(
      (l) =>
        l.startsWith("+") ||
        l.startsWith("-") ||
        (!l.startsWith("@@") &&
          !l.startsWith("diff --git") &&
          !l.startsWith("index"))
    )
    .map((l) => l.replace(/^[-+]/, "").trim());

  const names = new Set();

  for (const { regex, group } of patterns) {
    for (const line of candidates) {
      const match = line.match(regex);
      if (match && match[group]) {
        names.add(match[group]);
      }
    }
  }

  return [...names];
}

export async function extractFunctionBlockFromFile(filePath, functionName) {
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split("\n");

  const startIndex = lines.findIndex(
    (line) =>
      line.includes(functionName) && line.match(/(function|const|let|async)/)
  );

  if (startIndex === -1) return null;

  let block = [];
  let openBraces = 0;
  let started = false;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("{")) openBraces += (line.match(/{/g) || []).length;
    if (line.includes("}")) openBraces -= (line.match(/}/g) || []).length;

    block.push(line);
    if (openBraces <= 0 && started) break;
    if (line.includes("{")) started = true;
  }

  return block.join("\n");
}

const scopePatterns = [
  { name: "function", regex: /function\s+([A-Z_a-z]\w*)/, group: 1 },
  {
    name: "exportFunction",
    regex: /export\s+function\s+([A-Z_a-z]\w*)/,
    group: 1,
  },
  {
    name: "arrowVar",
    regex: /(const|let|var)\s+([A-Z_a-z]\w*)\s*=\s*(async\s*)?\(?.*=>/,
    group: 2,
  },
  { name: "useEffect", regex: /useEffect\s*\(/, group: 0 },
  // 🛑 no pongas return acá por ahora
];

export function buildContextHierarchyForChunk(diffChunk, contextList) {
  const lines = diffChunk.split("\n");
  const scopedChanges = [];

  let lineNumber = 0;

  for (const rawLine of lines) {
    if (rawLine.startsWith("@@")) {
      const match = rawLine.match(/\+(\d+)/);
      if (match) {
        lineNumber = parseInt(match[1], 10) - 1;
      }
      continue;
    }

    if (rawLine.startsWith("+") || rawLine.startsWith("-")) {
      lineNumber++;

      const matchingContexts = contextList.filter(
        (ctx) =>
          lineNumber >= ctx.loc.start.line && lineNumber <= ctx.loc.end.line
      );

      // 🔁 Ordenamos por profundidad para jerarquía: más externo a más interno
      matchingContexts.sort((a, b) => {
        const aSpan = a.loc.end.line - a.loc.start.line;
        const bSpan = b.loc.end.line - b.loc.start.line;
        return bSpan - aSpan; // mayor span = más externo
      });

      const hierarchy = matchingContexts.map((c) => c.id);

      scopedChanges.push({
        line: rawLine,
        contextHierarchy: hierarchy,
      });
    } else if (!rawLine.startsWith("-")) {
      lineNumber++;
    }
  }

  return scopedChanges;
}

/**
 * Extrae una lista de contextos desde el código fuente utilizando Babel.
 * Cada contexto puede ser una función, arrow function o un hook como useEffect.
 *
 * @param {string} sourceCode - Código fuente del archivo
 * @returns {Array} Lista de contextos con { id, type, loc, code }
 */
export function extractContextMapFromCode(sourceCode, filename = undefined) {
  const ast = parse(sourceCode, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  const contexts = [];

  traverse(ast, {
    FunctionDeclaration(path) {
      const name = path.node.id?.name;
      if (name) {
        contexts.push({
          id: name,
          type: "function",
          loc: {
            ...path.node.loc,
            filename,
          },
          code: sourceCode.slice(path.node.start, path.node.end),
        });
      }
    },

    VariableDeclarator(path) {
      const init = path.node.init;
      if (
        init?.type === "ArrowFunctionExpression" ||
        init?.type === "FunctionExpression"
      ) {
        const name = path.node.id?.name;
        if (name) {
          contexts.push({
            id: name,
            type: "arrow",
            loc: {
              ...path.node.loc,
              filename,
            },
            code: sourceCode.slice(path.node.start, path.node.end),
          });
        }
      }
    },

    CallExpression(path) {
      const callee = path.node.callee;
      if (
        callee.name === "useEffect" ||
        (callee.type === "Identifier" && callee.name === "useEffect")
      ) {
        const loc = path.node.loc.start;
        const id = `useEffect@${loc.line}:${loc.column}`;
        contexts.push({
          id,
          type: "hook",
          loc: {
            ...path.node.loc,
            filename,
          },
          code: sourceCode.slice(path.node.start, path.node.end),
        });
      }
    },
  });

  return contexts;
}

export function agruparPorRelaciones(bloques) {
  const grafo = new Map();

  // Construir el grafo no dirigido usando filePath como identificador estable
  for (const bloque of bloques) {
    const id = bloque.filePath || bloque.filename;

    if (!grafo.has(id)) {
      grafo.set(id, new Set());
    }

    for (const related of bloque.relatedFiles) {
      grafo.get(id).add(related);

      if (!grafo.has(related)) {
        grafo.set(related, new Set());
      }
      grafo.get(related).add(id); // relaci�n bidireccional
    }
  }

  const visitados = new Set();
  const grupos = [];

  for (const bloque of bloques) {
    const id = bloque.filePath || bloque.filename;

    if (visitados.has(id)) continue;

    // BFS/DFS para buscar todos los conectados
    const cola = [id];
    const componente = new Set();

    while (cola.length) {
      const actual = cola.pop();
      if (visitados.has(actual)) continue;

      visitados.add(actual);
      componente.add(actual);

      for (const vecino of grafo.get(actual) || []) {
        if (!visitados.has(vecino)) {
          cola.push(vecino);
        }
      }
    }

    // Agrupar los bloques correspondientes al componente
    const grupo = bloques.filter((b) =>
      componente.has(b.filePath || b.filename)
    );
    grupos.push(grupo);
  }

  return grupos;
}
