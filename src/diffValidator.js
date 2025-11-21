import chalk from "chalk";
import { getGitDiff } from "./gitHandler.js";
import { splitDiffByFile } from "./codeHandler.js";
import { t } from "./i18n.js";

export async function getAndValidateDiff(isVerbose, lang = "en") {
  let diff;
  try {
    diff = await getGitDiff();
  } catch (err) {
    console.error(chalk.red(t("errorFetchingDiff", lang) || "Could not obtain git diff"), err.message);
    return null;
  }

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
  const deletedBlocks = blocks.filter((b) => b.wasDeleted && !b.isBinary);
  const otherBlocks = blocks.filter((b) => !b.wasDeleted && !b.isBinary);

  const movedSummaries = detectMovedFunctions(deletedBlocks, otherBlocks, isVerbose, lang);

  const artificialBlocks = movedSummaries.map((summary) => {
    const { originalFile, movedFunctions } = summary;
    const movedList = movedFunctions
      .map((f) => `- \`${f.func}\` -> \`${f.newFile}\``)
      .join("\n");

    const detectString =
      movedList.length > 0
        ? `The file \`${originalFile}\` was deleted, and the following functions were relocated:\n\n${movedList}`
        : `The file \`${originalFile}\` was deleted. No relocated functions were detected automatically.`;

    return {
      filePath: originalFile,
      wasDeleted: true,
      block: `
# DELETED FILE

${detectString}

This block represents either a refactor or removal decision.
`,
      isArtificial: true,
      movedFunctions,
    };
  });

  if (isVerbose && artificialBlocks.length) {
    console.log(chalk.blue(t("artificialBlocks", lang)));
    console.table(
      artificialBlocks.map((b) => ({
        file: b.filePath,
        type: b.movedFunctions?.length > 0 ? "Refactor" : "Deleted (no refactor)",
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

export function detectMovedFunctions(deletedBlocks, otherBlocks, isVerbose = false, lang = "en") {
  if (isVerbose && deletedBlocks.length) {
    console.log(chalk.gray(t("skippingAggressiveMoveDetection", lang) || "Skipping aggressive move detection; only tracking deletions."));
  }

  // Conservative approach: just report deletions, avoid fragile name-based matching.
  return deletedBlocks.map((b) => ({
    originalFile: b.filePath,
    movedFunctions: [],
  }));
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
