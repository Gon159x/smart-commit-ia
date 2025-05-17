import chalk from "chalk";
import { getGitDiff } from "./gitHandler.js";
import { splitDiffByFile } from "./codeHandler.js";

export async function getAndValidateDiff(isVerbose) {
  const diff = await getGitDiff();

  if (!diff.trim()) {
    console.log(chalk.yellow("⚠️  No hay cambios staged en Git."));
    console.log(chalk.gray("Usá `git add <archivo>` para preparar cambios."));
    return null;
  }

  if (isVerbose) {
    console.log(chalk.gray("\n🔍 Diff completo:\n"));
    console.log(diff);
  }

  const blocks = splitDiffByFile(diff);

  console.log(chalk.green(`✅ ${blocks.length} archivo(s) modificado(s):\n`));
  blocks.forEach((block, i) =>
    console.log(chalk.yellow(`📄 Archivo ${i + 1}: ${block.filePath}`))
  );

  return blocks;
}
