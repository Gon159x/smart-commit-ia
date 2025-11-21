import assert from "node:assert/strict";
import { test } from "node:test";
import { splitDiffByFile, agruparPorRelaciones } from "../src/codeHandler.js";
import { obtenerArchivosDesdeDiff } from "../src/commitFlow.js";
import { detectMovedFunctions } from "../src/diffValidator.js";

test("splitDiffByFile preserves file paths", () => {
  const diff = `diff --git a/src/index.js b/src/index.js
--- a/src/index.js
+++ b/src/index.js
@@ -1,2 +1,2 @@
-console.log("old")
+console.log("new")
`;
  const blocks = splitDiffByFile(diff);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].filePath, "src/index.js");
  assert.equal(blocks[0].wasDeleted, false);
});

test("agruparPorRelaciones uses full paths to avoid collisions", () => {
  const bloques = [
    { filename: "index.js", filePath: "src/index.js", relatedFiles: ["src/shared.js"] },
    { filename: "index.js", filePath: "test/index.js", relatedFiles: ["test/shared.js"] },
    { filename: "shared.js", filePath: "src/shared.js", relatedFiles: [] },
    { filename: "shared.js", filePath: "test/shared.js", relatedFiles: [] },
  ];

  const grupos = agruparPorRelaciones(bloques);
  const groupPaths = grupos.map((g) => g.map((b) => b.filePath).sort());
  assert.deepEqual(
    groupPaths,
    [
      ["src/index.js", "src/shared.js"].sort(),
      ["test/index.js", "test/shared.js"].sort(),
    ]
  );
});

test("obtenerArchivosDesdeDiff matches by full path", () => {
  const summaries = [
    { resumen: { files: ["src/a.js"] } },
    { resumen: { files: ["src/b.js"] } },
  ];
  const blocks = [
    { filePath: "src/a.js", block: "" },
    { filePath: "src/b.js", block: "" },
    { filePath: "src/c.js", block: "" },
  ];

  const result = obtenerArchivosDesdeDiff(summaries, blocks);
  assert.deepEqual(result.sort(), ["src/a.js", "src/b.js"].sort());
});

test("detectMovedFunctions keeps deletions without aggressive matches", () => {
  const deleted = [
    { filePath: "old.js", block: "- function a() {}" },
  ];
  const added = [
    { filePath: "new.js", block: "+ function a() {}" },
  ];

  const moved = detectMovedFunctions(deleted, added);
  assert.equal(moved.length, 1);
  assert.equal(moved[0].originalFile, "old.js");
  assert.deepEqual(moved[0].movedFunctions, []);
});
