import chalk from "chalk";
import { getGitDiff } from "./gitHandler.js";
import { splitDiffByFile } from "./codeHandler.js";
import { t } from "./i18n.js";

export function Dashboard() {
  return 32;
}

export function increment() {
  return 32;
}

export async function getAndValidateDiff(isVerbose, lang = "en") {
  const diff = await getGitDiff();

  if (!diff.trim()) {
    console.log(chalk.yellow(t("noStagedChanges", lang)));
    console.log(chalk.gray(t("useGitAdd", lang)));
    return null;
  }

  if (isVerbose) {
    console.log(chalk.gray(t("fullDiff", lang)));
    console.log(diff);
  }

  const blocks = splitDiffByFile(diff);
  const deletedBlocks = blocks.filter((b) => b.wasDeleted);
  const otherBlocks = blocks.filter((b) => !b.wasDeleted);

  const movedSummaries = detectMovedFunctions(deletedBlocks, otherBlocks);

  if (isVerbose) {
    console.log(
      chalk.green(`✅ ${movedSummaries.length} ${t("functionsMoved", lang)}`)
    );
    console.log(chalk.green(`✅ ${t("refactorSummary", lang)}`));
    console.dir(movedSummaries, { depth: null, colors: true });
  }

  const artificialBlocks = movedSummaries.map((summary) => {
    const { originalFile, movedFunctions } = summary;
    const movedList = movedFunctions
      .map((f) => `- \`${f.func}\` → \`${f.newFile}\``)
      .join("\n");

    const detectString =
      movedList.length > 0
        ? `The file \`${originalFile}\` was deleted, but the following functions were relocated:\n\n${movedList}`
        : `The file \`${originalFile}\` was deleted and no functions were detected as relocated.`;

    return {
      filePath: originalFile,
      wasDeleted: true,
      block: `
# ⚠️ DELETED FILE

${detectString}

This block represents either a refactor or removal decision.
`,
      isArtificial: true,
      movedFunctions,
    };
  });

  if (isVerbose) {
    console.log(chalk.blue(t("artificialBlocks", lang)));
    console.table(
      artificialBlocks.map((b) => ({
        file: b.filePath,
        type:
          b.movedFunctions?.length > 0 ? "Refactor" : "Deleted (no refactor)",
      }))
    );
  }

  const deletedFilesWithArtificial = new Set(
    artificialBlocks.map((b) => b.filePath)
  );

  const filteredOriginalBlocks = blocks.filter(
    (b) => !(b.wasDeleted && deletedFilesWithArtificial.has(b.filePath))
  );

  if (isVerbose) {
    console.log(
      chalk.gray(
        t("removedBlocksInfo", lang).replace(
          "{count}",
          blocks.length - filteredOriginalBlocks.length
        )
      )
    );
  }

  return { removedBlocks: artificialBlocks, blocks: filteredOriginalBlocks };
}

export function detectMovedFunctions(deletedBlocks, otherBlocks) {
  const removedFunctionsByFile = deletedBlocks.map((b) => ({
    filePath: b.filePath,
    functions: extractRemovedFunctions(b.block),
  }));

  const addedFunctionsByFile = otherBlocks.map((b) => ({
    filePath: b.filePath,
    functions: extractAddedFunctions(b.block),
  }));

  const movedSummaries = [];

  for (const { filePath, functions } of removedFunctionsByFile) {
    const moved = [];

    for (const func of functions) {
      for (const addedBlock of addedFunctionsByFile) {
        if (addedBlock.functions.includes(func)) {
          moved.push({ func, newFile: addedBlock.filePath });
        }
      }
    }

    movedSummaries.push({
      originalFile: filePath,
      movedFunctions: moved,
    });
  }

  return movedSummaries;
}

function extractRemovedFunctions(diffBlock) {
  const lines = diffBlock.split("\n");
  return lines
    .filter((line) => line.startsWith("-") && /function|const|let/.test(line))
    .map((line) => {
      const clean = line.replace(/^-/, "").trim();
      const match = clean.match(/(?:function|const|let)\s+([a-zA-Z0-9_]+)/);
      return match?.[1] || null;
    })
    .filter(Boolean);
}

function extractAddedFunctions(diffBlock) {
  const lines = diffBlock.split("\n");
  return lines
    .filter((line) => line.startsWith("+") && /function|const|let/.test(line))
    .map((line) => {
      const clean = line.replace(/^\+/, "").trim();
      const match = clean.match(/(?:function|const|let)\s+([a-zA-Z0-9_]+)/);
      return match?.[1] || null;
    })
    .filter(Boolean);
}
