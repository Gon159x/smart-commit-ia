// src/cliSetup.js

import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { getAPIKey, getLanguage } from "./config.js";
import { stageAllChanges } from "./gitHandler.js";

export async function setupCLI() {
  const isVerbose = process.argv.includes("--verbose");

  // 🔐 Obtener API Key y mostrar los primeros caracteres
  const apiKey = await getAPIKey();
  console.log(chalk.blue(`🔐 Usando API Key: ${apiKey.slice(0, 6)}...\n`));

  // 🌍 Obtener idioma desde config o por prompt
  const lang = await getLanguage();
  console.log(chalk.gray(`🌐 Idioma: ${chalk.yellow(lang)}\n`));

  // 📦 Confirmar si se debe ejecutar git add .
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

  // Devolver datos relevantes para el flujo principal
  return { isVerbose, apiKey, lang };
}
