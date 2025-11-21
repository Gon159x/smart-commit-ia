import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import { analyzeDeletesBlocks, analyzeDiffBlock } from "./analyzeWithLLM.js";
import { t } from "./i18n.js";

const LARGE_DIFF_LINE_THRESHOLD = 2000;
const CONCURRENCY =
  Number.parseInt(process.env.AI_COMMIT_CONCURRENCY, 10) > 0
    ? Number.parseInt(process.env.AI_COMMIT_CONCURRENCY, 10)
    : 3;

function createLimiter(limit = 3) {
  let active = 0;
  const queue = [];

  const runNext = () => {
    if (active >= limit || queue.length === 0) return;
    const { task, resolve, reject } = queue.shift();
    active += 1;
    task()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        active -= 1;
        runNext();
      });
  };

  return (task) =>
    new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject });
      if (active < limit) {
        runNext();
      }
    });
}

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
    filePath,
    relatedFiles: [],
  };
}

function buildLargeDiffPlaceholder(filePath, lineCount) {
  const filename = path.basename(filePath);
  return {
    title: `chore: ${filename} (large diff noted)`,
    content: `### Changes in ${filename}\n- Large diff (~${lineCount} lines) skipped per user choice. File is touched in this commit.`,
    filename,
    filePath,
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
  lang = "en",
  apiKey
) {
  const parsedBlocks = [];
  const baseToPaths = new Map();
  const statusMap = new Map();

  [...blocks, ...removedBlocks].forEach((b) => {
    const base = path.basename(b.filePath);
    if (!baseToPaths.has(base)) {
      baseToPaths.set(base, []);
    }
    baseToPaths.get(base).push(b.filePath);
  });

  const resolveRelated = (list = []) =>
    list.map((item) => {
      const matches = baseToPaths.get(path.basename(item));
      if (matches?.length === 1) {
        return matches[0];
      }
      return item;
    });

  if (removedBlocks.length > 0) {
    const spinner = ora(t("analyzingDeleted", lang)).start();
    try {
      const result = await analyzeDeletesBlocks(
        removedBlocks,
        model,

        isVerbose,
        lang,
        apiKey
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
        title: result?.title,
        content: result?.content,
        filename: "deleted_files_summary",
        filePath: "deleted_files_summary",
        relatedFiles: resolveRelated(relatedFiles),
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

  const totalBlocks = blocks.length;
  let active = 0;
  let completed = 0;
  const orderedPaths = blocks.map((b) => b.filePath);

  const progress =
    totalBlocks > 0
      ? ora(t("analyzingFile", lang).replace("{file}", "")).start()
      : null;

  const stateOrder = { running: 0, error: 1, done: 2, skipped: 3, pending: 4 };
  const stateIcons = {
    running: "⏳",
    done: "✅",
    skipped: "⤴",
    pending: "…",
    error: "❌",
  };

  const renderProgress = () => {
    if (!progress) return;
    const lines = orderedPaths
      .map((file) => ({
        file,
        state: statusMap.get(file) || "pending",
      }))
      .sort((a, b) => stateOrder[a.state] - stateOrder[b.state])
      .map(({ file, state }) => `${stateIcons[state]} [${state}] ${file}`);
    progress.text = `${t("analyzingFile", lang).replace("{file}", "")} ${completed}/${totalBlocks}\n${lines.join(
      "\n"
    )}`;
  };

  const setStatus = (filePath, state) => {
    statusMap.set(filePath, state);
    renderProgress();
  };

  const markDone = (filePath) => {
    active = Math.max(0, active - 1);
    completed += 1;
    setStatus(filePath, "done");
  };

  const limit = createLimiter(CONCURRENCY);
  const tasks = blocks.map((blockInfo) =>
    limit(async () => {
      const { filePath, block, isBinary, lineCount } = blockInfo;
      const diffLines = lineCount ?? block.split(/\r?\n/).length;
      active += 1;
      setStatus(filePath, "running");

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
        markDone(filePath);
        return;
      }

      if (diffLines > LARGE_DIFF_LINE_THRESHOLD) {
        progress?.stop();
        const decision = await askForLargeDiffHandling(
          filePath,
          diffLines,
          lang
        );
        progress?.start();
        renderProgress();

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
          statusMap.set(filePath, "skipped");
          markDone(filePath);
          return;
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
          statusMap.set(filePath, "skipped");
          markDone(filePath);
          return;
        }
      }

      try {
        const result = await analyzeDiffBlock(
          block,
          model,
          filePath,
          isVerbose,
          lang,
          apiKey
        );

        if (!result) {
          statusMap.set(filePath, "error");
          markDone(filePath);
          return;
        }

        const parsed = {
          title: result.title,
          content: result.content,
          filename: path.basename(filePath),
          filePath,
          relatedFiles: resolveRelated(result.relatedFiles || []),
        };

        parsedBlocks.push(parsed);
        setStatus(filePath, "done");

        if (isVerbose) {
          console.log(chalk.blueBright(t("verboseAnalyzeResponse", lang)));
          console.dir(result, { depth: null, colors: true });
        }
      } catch (err) {
        progress?.stop();
        console.error(err);
        progress?.start();
        statusMap.set(filePath, "error");
      }
      markDone(filePath);
    })
  );

  await Promise.all(tasks);

  if (progress) {
    progress.succeed(
      `${t("fileProcessed", lang).replace(
        "{file}",
        ""
      )} ${completed}/${totalBlocks}`
    );
  }

  return { parsedBlocks };
}

export function printGitAdviceIfNeeded(groupedBlocks, lang = "en") {
  if (groupedBlocks.length <= 1) return;

  console.log(chalk.blueBright(`\n${t("gitAdviceTitle", lang)}`));
  console.log(
    chalk.gray(
      t("gitAdviceText", lang).replace("{tool}", chalk.cyan("ai-commit"))
    )
  );

  console.log(chalk.blueBright(`\n${t("aiAdviceTitle", lang)}`));
  console.log(
    chalk.gray(
      t("aiAdviceText", lang).replace(/\{tool\}/g, chalk.cyan("ai-commit"))
    )
  );
}
