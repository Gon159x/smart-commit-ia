import ora from "ora";
import chalk from "chalk";
import path from "path";
import inquirer from "inquirer";
import { analyzeDiffBlock, analyzeDeletesBlocks } from "./analyzeWithLLM.js";
import { t } from "./i18n.js";

const LARGE_DIFF_LINE_THRESHOLD = 2000;

function buildBinarySummary(filePath, block) {
  const filename = path.basename(filePath);
  const changeType = block.wasDeleted
    ? "deleted"
    : block.isNewFile
    ? "added"
    : block.renameFrom
    ? "renamed"
    : "updated";

  const renameNote =
    changeType === "renamed" && block.renameFrom
      ? ` (from ${path.basename(block.renameFrom)})`
      : "";

  return {
    title: `chore: binary asset ${changeType}`,
    content: `### Changes in ${filename}\n- Binary asset ${changeType}${renameNote}. Diff skipped.`,
    filename,
    relatedFiles: [],
  };
}

function buildLargeDiffPlaceholder(filePath, lineCount) {
  const filename = path.basename(filePath);
  return {
    title: `chore: ${filename} (large diff noted)`,
    content: `### Changes in ${filename}\n- Large diff (~${lineCount} lines) skipped per user choice. File is touched in this commit.`,
    filename,
    relatedFiles: [],
  };
}

async function askForLargeDiffHandling(filePath, lineCount, lang) {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: t("largeDiffPrompt", lang)
        .replace("{file}", filePath)
        .replace("{lines}", lineCount),
      choices: [
        { name: t("largeDiffAnalyze", lang), value: "analyze" },
        { name: t("largeDiffSkipWithNote", lang), value: "note" },
        { name: t("largeDiffSkip", lang), value: "skip" },
      ],
    },
  ]);

  return choice;
}

export async function analyzeBlocksWithIA(
  blocks,
  model,
  isVerbose,
  removedBlocks = [],
  lang = "en"
) {
  const parsedBlocks = [];

  if (removedBlocks.length > 0) {
    const spinner = ora(t("analyzingDeleted", lang)).start();
    try {
      const result = await analyzeDeletesBlocks(
        removedBlocks,
        model,

        isVerbose,
        lang
      );
      spinner.succeed(t("deletedSummarySuccess", lang));

      const relatedFiles = Array.from(
        new Set(
          removedBlocks.flatMap((b) =>
            (b.movedFunctions || []).map((f) => path.basename(f.newFile))
          )
        )
      );

      const parsed = {
        title: result.title,
        content: result.content,
        filename: "deleted_files_summary",
        relatedFiles,
      };

      parsedBlocks.push(parsed);

      if (isVerbose) {
        console.log(chalk.blueBright(t("verboseDeletedSummary", lang)));
        console.dir(result, { depth: null, colors: true });
      }
    } catch (err) {
      spinner.fail(t("errorProcessingDeleted", lang));
      console.error(err);
    }
  }

  for (const blockInfo of blocks) {
    const { filePath, block, isBinary, lineCount } = blockInfo;
    const diffLines = lineCount ?? block.split(/\r?\n/).length;

    if (isBinary) {
      const parsed = buildBinarySummary(filePath, blockInfo);
      parsedBlocks.push(parsed);
      if (isVerbose) {
        console.log(
          chalk.yellow(
            t("binaryFileSkipped", lang).replace("{file}", filePath)
          )
        );
      }
      continue;
    }

    if (diffLines > LARGE_DIFF_LINE_THRESHOLD) {
      const decision = await askForLargeDiffHandling(filePath, diffLines, lang);

      if (decision === "skip") {
        if (isVerbose) {
          console.log(
            chalk.yellow(
              t("largeDiffSkipped", lang)
                .replace("{file}", filePath)
                .replace("{lines}", diffLines)
            )
          );
        }
        continue;
      }

      if (decision === "note") {
        parsedBlocks.push(buildLargeDiffPlaceholder(filePath, diffLines));
        if (isVerbose) {
          console.log(
            chalk.yellow(
              t("largeDiffNoted", lang)
                .replace("{file}", filePath)
                .replace("{lines}", diffLines)
            )
          );
        }
        continue;
      }
    }

    const spinner = ora(t("analyzingFile", lang).replace("{file}", filePath)).start();
    try {
      const result = await analyzeDiffBlock(
        block,
        model,
        filePath,
        isVerbose,
        lang
      );
      spinner.succeed(t("fileProcessed", lang).replace("{file}", filePath));

      const parsed = {
        title: result.title,
        content: result.content,
        filename: path.basename(filePath),
        relatedFiles: result.relatedFiles || [],
      };

      parsedBlocks.push(parsed);

      if (isVerbose) {
        console.log(chalk.blueBright(t("verboseAnalyzeResponse", lang)));
        console.dir(result, { depth: null, colors: true });
      }
    } catch (err) {
      spinner.fail(t("errorProcessingFile", lang).replace("{file}", filePath));
      console.error(err);
    }
  }

  return { parsedBlocks };
}

export function printGitAdviceIfNeeded(groupedBlocks, lang = "en") {
  if (groupedBlocks.length <= 1) return;

  console.log(chalk.blueBright(`\n${t("gitAdviceTitle", lang)}`));
  console.log(
    chalk.gray(t("gitAdviceText", lang).replace("{tool}", chalk.cyan("ai-commit")))
  );

  console.log(chalk.blueBright(`\n${t("aiAdviceTitle", lang)}`));
  console.log(
    chalk.gray(
      t("aiAdviceText", lang).replace(/\{tool\}/g, chalk.cyan("ai-commit"))
    )
  );
}
