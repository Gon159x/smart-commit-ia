import fs from "fs";
import path from "path";
import { splitDiffByFile, splitDiffIntoChunks } from "./codeHandler.js";
import { t } from "./i18n.js";

import { extractContextMapFromCode } from "./contextExtractor.js"; // nuevo AST completo

export async function buildContextForDiff(diffText, lang = "en") {
  const blocks = splitDiffByFile(diffText);
  const enriched = [];

  for (const { filePath, block } of blocks) {
    const fullPath = path.join(process.cwd(), filePath);

    let sourceCode = null;
    try {
      sourceCode = fs.readFileSync(fullPath, "utf-8");
    } catch {
      console.warn(`${t("fileReadWarning", lang)} ${fullPath}`);
      continue;
    }

    // 🧠 Extraer el árbol jerárquico de contextos
    const contextMap = extractContextMapFromCode(sourceCode, filePath, lang);
    const scopedChanges = [];
    let changeIdCounter = 1;

    const chunks = splitDiffIntoChunks(block);

    for (const chunk of chunks) {
      const lines = chunk.split("\n");
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

          // Encontrar todos los contextos que contienen esta línea
          const matching = Object.values(contextMap).filter(
            (ctx) =>
              ctx.loc.start.line <= lineNumber && ctx.loc.end.line >= lineNumber
          );

          // De más general a más específico (para jerarquía de árbol)
          matching.sort(
            (a, b) =>
              a.loc.end.line -
              a.loc.start.line -
              (b.loc.end.line - b.loc.start.line)
          );

          const hierarchy = matching.map((ctx) => ctx.id);
          const refs = [...hierarchy].reverse(); // de más específico a más general

          const changeId = `chg${changeIdCounter++}`;

          // Asociar change al contextMap
          for (const ctxId of hierarchy) {
            if (!contextMap[ctxId].changes.includes(changeId)) {
              contextMap[ctxId].changes.push(changeId);
            }
          }

          scopedChanges.push({
            id: changeId,
            line: rawLine,
            contextHierarchy: hierarchy,
            contextRefs: refs,
          });
        } else if (!rawLine.startsWith("-")) {
          lineNumber++;
        }
      }
    }

    enriched.push({
      filePath,
      diff: block,
      contextMap,
      scopedChanges,
    });
  }

  return enriched;
}
