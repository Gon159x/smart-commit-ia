import os from "os";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";

// Ruta del archivo de configuración local
const configPath = path.join(
  os.homedir(),
  ".config",
  "smart-commit-ia",
  "config.json"
);

export async function getAPIKey() {
  // Si ya existe el archivo, devolverla
  if (await fs.pathExists(configPath)) {
    const config = await fs.readJson(configPath);
    return config.apiKey;
  }

  // Si no existe, pedirla al usuario
  const { apiKey } = await inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message: "🔑 Ingresá tu OpenRouter API Key:",
      validate: (input) =>
        input.trim() !== "" || "La API Key no puede estar vacía.",
    },
  ]);

  // Crear carpeta si no existe
  await fs.ensureDir(path.dirname(configPath));

  // Guardar la API key
  await fs.writeJson(configPath, { apiKey }, { spaces: 2 });

  return apiKey;
}
