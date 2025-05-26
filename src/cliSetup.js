// src/cliSetup.js

import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { getAPIKey, getLanguage } from "./config.js";
import { stageAllChanges } from "./gitHandler.js";
import { t } from "./i18n.js";

export async function setupCLI() {
  const isVerbose = process.argv.includes("--verbose");

  // 🔐 Obtener API Key y mostrar los primeros caracteres
  const apiKey = await getAPIKey();

  // 🌍 Obtener idioma desde config o por prompt
  const lang = await getLanguage();

  // 🔐 Mostrar info usando i18n
  console.log(
    chalk.blue(`${t("apiKeyUsage", lang)}${apiKey.slice(0, 6)}...\n`)
  );
  console.log(
    chalk.gray(`${t("languageLabel", lang)}: ${chalk.yellow(lang)}\n`)
  );

  // 📦 Confirmar si se debe ejecutar git add .
  const { shouldAdd } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldAdd",
      message: t("confirmAddChanges", lang),
      default: true,
    },
  ]);

  if (shouldAdd) {
    const spinner = ora(t("runningGitAdd", lang)).start();
    await stageAllChanges();
    spinner.succeed(t("changesAdded", lang));
  }

  // Devolver datos relevantes para el flujo principal
  return { isVerbose, apiKey, lang };
}
