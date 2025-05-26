// src/config.js
import os from "os";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import { t } from "./i18n.js";

// Ruta centralizada del archivo de configuración
const configPath = path.join(
  os.homedir(),
  ".config",
  "smart-commit-ia",
  "config.json"
);

export async function loadConfig() {
  if (await fs.pathExists(configPath)) {
    return fs.readJson(configPath);
  }
  return {};
}

export async function saveConfig(config) {
  await fs.ensureDir(path.dirname(configPath));
  await fs.writeJson(configPath, config, { spaces: 2 });
}

export async function getAPIKey() {
  const config = await loadConfig();
  if (config.apiKey) return config.apiKey;

  const langPrompt = getLangFromArgs() || "es";

  const { apiKey } = await inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message: t("apiKeyPrompt", langPrompt),
      validate: (input) => input.trim() !== "" || t("apiKeyEmpty", langPrompt),
    },
  ]);

  config.apiKey = apiKey;
  await saveConfig(config);
  return apiKey;
}

export async function getLanguage() {
  const cliArgLang = getLangFromArgs();
  const config = await loadConfig();

  if (cliArgLang) {
    config.lang = cliArgLang;
    await saveConfig(config);
    return cliArgLang;
  }

  if (config.lang) return config.lang;

  const { selectedLang } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedLang",
      message: t("selectLanguage", "es"),
      choices: [
        { name: "Español", value: "es" },
        { name: "English", value: "en" },
      ],
    },
  ]);

  config.lang = selectedLang;
  await saveConfig(config);
  return selectedLang;
}

// 🧠 Analizar args tipo --lang en o --en
function getLangFromArgs() {
  const args = process.argv;
  const langArg = args.find((arg) => arg === "--es" || arg === "--en");

  if (langArg === "--es") return "es";
  if (langArg === "--en") return "en";

  const langIndex = args.findIndex((arg) => arg === "--lang");
  if (langIndex !== -1 && args[langIndex + 1]) {
    const value = args[langIndex + 1];
    if (["es", "en"].includes(value)) {
      return value;
    }
  }

  return null;
}
