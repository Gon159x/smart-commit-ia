import ora from "ora";
import chalk from "chalk";
import path from "path";
import { analyzeDiffBlock, analyzeDeletesBlocks } from "./analyzeWithLLM.js";
import { t } from "./i18n.js";

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

  for (const { filePath, block } of blocks) {
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
