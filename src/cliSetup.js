import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { getAPIKey, getLanguage, loadConfig, saveConfig } from "./config.js";
import { stageAllChanges } from "./gitHandler.js";
import { t } from "./i18n.js";

export async function setupCLI() {
  const args = process.argv;
  const isVerbose = args.includes("--verbose");

  // 🧠 Analizar idioma por bandera (lang flag o atajo --en / --es)
  const langFlagIndex = args.indexOf("--lang");
  const langFromFlag =
    (langFlagIndex !== -1 && args[langFlagIndex + 1]) || null;
  const langShortcut = args.includes("--en")
    ? "en"
    : args.includes("--es")
    ? "es"
    : null;

  // 📦 Cargar config para saber el idioma guardado
  const config = await loadConfig();
  const langFromConfig = config.lang;

  // 🧠 Prioridad de idioma: bandera > config > fallback
  const lang = langFromFlag || langShortcut || langFromConfig || "es";

  // 📘 Mostrar ayuda y salir
  if (args.includes("--help")) {
    // 📝 Guardar el idioma usado (si viene por bandera)
    if (langFromFlag || langShortcut) {
      config.lang = lang;
      await saveConfig(config);
    }

    // Mostrar ayuda traducida
    console.log(chalk.blue.bold(`\n${t("helpTitle", lang)}`));
    console.log(t("helpDescription", lang));
    console.log(t("helpLang", lang));
    console.log(t("helpVerbose", lang));
    console.log(t("helpHelp", lang));
    process.exit(0);
  }

  // 🔐 Obtener API Key y mostrar los primeros caracteres
  const apiKey = await getAPIKey();

  // 🌍 Obtener idioma definitivo (pregunta si no hay, o guarda flag nueva)
  const resolvedLang = await getLanguage();

  // Mostrar info con i18n
  console.log(
    chalk.blue(`${t("apiKeyUsage", resolvedLang)}${apiKey.slice(0, 6)}...\n`)
  );
  console.log(
    chalk.gray(
      `${t("languageLabel", resolvedLang)}: ${chalk.yellow(resolvedLang)}\n`
    )
  );

  // 📦 Confirmar si se debe ejecutar git add .
  const { shouldAdd } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldAdd",
      message: t("confirmAddChanges", resolvedLang),
      default: true,
    },
  ]);

  if (shouldAdd) {
    const spinner = ora(t("runningGitAdd", resolvedLang)).start();
    await stageAllChanges();
    spinner.succeed(t("changesAdded", resolvedLang));
  }

  return { isVerbose, apiKey, lang: resolvedLang };
}
