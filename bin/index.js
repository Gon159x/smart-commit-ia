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

export async function summarizeCommits(grouped, model, isVerbose) {
  const summaries = [];

  for (const grupo of grouped) {
    const resumen = await summarizeCommit(grupo, model, "es", isVerbose);
    summaries.push({ resumen, grupo });

    console.log(chalk.green.bold("\n🔹 Commit sugerido:"));
    console.log(chalk.cyan(resumen.title));
    console.log(resumen.content);
    console.log(
      chalk.gray(`📁 Archivos: ${chalk.yellow(resumen.files.join(", "))}`)
    );
  }

  return summaries;
}

async function main() {
  const { isVerbose } = await setupCLI();
  const result = await getAndValidateDiff(isVerbose);

  if (!result) {
    return;
  }

  const { blocks, removedBlocks } = result;
  // continuar con blocks y removedBlocks...

  if (!blocks) return;

  const model = await chooseModel();
  const { parsedBlocks } = await analyzeBlocksWithIA(
    blocks,
    model,
    isVerbose,
    removedBlocks
  );

  const grouped = agruparPorRelaciones(parsedBlocks);
  printGitAdviceIfNeeded(grouped);

  const summaries = await summarizeCommits(grouped, model, isVerbose);

  console.log("\n\n\n");
  // console.log(chalk.gray("\n📤 summaries:\n"));
  // console.dir(summaries, { depth: null, colors: true });

  const accion = await promptCommitAction(summaries);
  await performCommitActions(accion, summaries, blocks);
}

main();
