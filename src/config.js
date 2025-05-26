import os from "os";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";

// Ruta centralizada del archivo de configuración
const configPath = path.join(
  os.homedir(),
  ".config",
  "smart-commit-ia",
  "config.json"
);

// Cargar configuración completa (o devolver objeto vacío)
export async function loadConfig() {
  if (await fs.pathExists(configPath)) {
    return fs.readJson(configPath);
  }
  return {};
}

// Guardar configuración
export async function saveConfig(config) {
  await fs.ensureDir(path.dirname(configPath));
  await fs.writeJson(configPath, config, { spaces: 2 });
}

// Obtener la API key
export async function getAPIKey() {
  const config = await loadConfig();

  if (config.apiKey) return config.apiKey;

  const { apiKey } = await inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message: "🔑 Ingresá tu OpenRouter API Key:",
      validate: (input) =>
        input.trim() !== "" || "La API Key no puede estar vacía.",
    },
  ]);

  config.apiKey = apiKey;
  await saveConfig(config);

  return apiKey;
}

// Obtener idioma, o preguntar si no está
export async function getLanguage() {
  const config = await loadConfig();

  if (config.lang) return config.lang;

  const { selectedLang } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedLang",
      message: "Seleccioná el idioma para la interfaz:",
      choices: [
        { name: "Español", value: "es" },
        { name: "English", value: "en" },
      ],
    },
  ]);

  config.lang = selectedLang;
  await saveConfig(config);

  console.log(
    `🌍 Idioma configurado: ${selectedLang}. Podés cambiarlo editando ${configPath}`
  );

  return selectedLang;
}
