#!/usr/bin/env node

import { getGitDiff } from "../src/getGitDiff.js";
import chalk from "chalk";

console.log(chalk.cyan("🚀 Smart Commit IA - Analizando cambios de Git...\n"));

try {
  const diff = await getGitDiff();

  if (!diff.trim()) {
    console.log(chalk.yellow("⚠️  No hay cambios staged en Git."));
    console.log(chalk.gray("Usá `git add <archivo>` para preparar cambios."));
  } else {
    console.log(chalk.green("✅ Cambios detectados:\n"));
    console.log(diff);
  }
} catch (err) {
  console.error(chalk.red("❌ Error al obtener el diff:"), err.message);
}
