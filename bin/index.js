#!/usr/bin/env node
import { setupCLI } from "../src/cliSetup.js";
import { getAndValidateDiff } from "../src/diffValidator.js";
import { chooseModel, summarizeCommit } from "../src/analyzeWithLLM.js";
import {
  analyzeBlocksWithIA,
  printGitAdviceIfNeeded,
} from "../src/analyzeFlow.js";
import { agruparPorRelaciones } from "../src/codeHandler.js";
import { promptCommitAction, performCommitActions } from "../src/commitFlow.js";
import chalk from "chalk";
import { t } from "../src/i18n.js";

export async function summarizeCommits(
  grouped,
  model,
  isVerbose,
  lang,
  apiKey
) {
  const summaries = [];

  for (const grupo of grouped) {
    const resumen = await summarizeCommit(grupo, model, lang, isVerbose, apiKey);
    summaries.push({ resumen, grupo });

    console.log(chalk.green.bold(`\n${t("suggestedCommit", lang)}`));
    console.log(chalk.cyan(resumen.title));
    console.log(resumen.content);
    console.log(
      chalk.gray(
        `${t("files", lang)} ${chalk.yellow(resumen.files.join(", "))}`
      )
    );
  }

  return summaries;
}

async function main() {
  const { isVerbose, lang, apiKey } = await setupCLI();

  const result = await getAndValidateDiff(isVerbose, lang);

  if (!result) {
    return;
  }

  const { blocks, removedBlocks } = result;
  // continuar con blocks y removedBlocks...

  if (!blocks) return;

  const model = await chooseModel(lang, apiKey);
  const { parsedBlocks } = await analyzeBlocksWithIA(
    blocks,
    model,
    isVerbose,
    removedBlocks,
    lang,
    apiKey
  );

  const grouped = agruparPorRelaciones(parsedBlocks);
  printGitAdviceIfNeeded(grouped, lang);

  const summaries = await summarizeCommits(
    grouped,
    model,
    isVerbose,
    lang,
    apiKey
  );

  console.log("\n\n\n");
  // console.log(chalk.gray("\n📤 summaries:\n"));
  // console.dir(summaries, { depth: null, colors: true });

  const accion = await promptCommitAction(summaries, lang);
  await performCommitActions(accion, summaries, blocks, lang);
}

main();
