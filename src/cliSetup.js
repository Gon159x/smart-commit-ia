import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { getAPIKey } from "./config.js";
import { stageAllChanges } from "./gitHandler.js";

export async function setupCLI() {
  const isVerbose = process.argv.includes("--verbose");

  const apiKey = await getAPIKey();
  console.log(chalk.blue(`🔐 Usando API Key: ${apiKey.slice(0, 6)}...\n`));

  const { shouldAdd } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldAdd",
      message: "¿Querés agregar los últimos cambios al commit con `git add .`?",
      default: true,
    },
  ]);

  if (shouldAdd) {
    const spinner = ora("📦 Ejecutando git add .").start();
    await stageAllChanges();
    spinner.succeed("✅ Cambios agregados.");
  }

  return { isVerbose, apiKey };
}
