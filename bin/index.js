#!/usr/bin/env node

import { getAPIKey } from "../src/config.js";
import {
  getGitDiff,
  stageAllChanges,
  stageSpecificFiles,
  commitWithMessage,
  unstageAllChanges,
} from "../src/gitHandler.js";
import {
  analyzeDiffBlock,
  chooseModel,
  summarizeCommit,
} from "../src/analyzeWithLLM.js";
import ora from "ora";
import chalk from "chalk";
import { agruparPorRelaciones, splitDiffByFile } from "../src/codeHandler.js";
import inquirer from "inquirer";
import path from "path";
import clipboardy from "clipboardy";

async function main() {
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

  console.log(
    chalk.cyan("🚀 Smart Commit IA - Analizando cambios de Git...\n")
  );

  try {
    const diff = await getGitDiff();

    if (!diff.trim()) {
      console.log(chalk.yellow("⚠️  No hay cambios staged en Git."));
      console.log(chalk.gray("Usá `git add <archivo>` para preparar cambios."));
      return;
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

    const model = await chooseModel();
    const parsedBlocks = [];

    for (const { filePath, block } of blocks) {
      const spinner = ora(`🤖 Analizando ${filePath} con IA...`).start();
      try {
        const result = await analyzeDiffBlock(
          block,
          model,
          filePath,
          isVerbose
        );
        spinner.succeed(`📄 ${filePath} procesado correctamente`);
        parsedBlocks.push({
          title: result.title,
          content: result.content,
          filename: path.basename(filePath),
          relatedFiles: result.relatedFiles || [],
        });
      } catch (err) {
        spinner.fail(`❌ Error al procesar ${filePath}`);
        console.error(err);
      }
    }

    const groupedBlocks = agruparPorRelaciones(parsedBlocks);
    const summaries = [];

    console.log(chalk.blueBright("\n📚 Consejo Git:"));
    console.log(
      chalk.gray(
        `Se recomienda realizar un commit por cada cambio con responsabilidad única.\n` +
          `Esto mejora la trazabilidad, facilita el trabajo en equipo y el uso de herramientas como git bisect.\n`
      )
    );

    console.log(chalk.blueBright("\n🤝 Un consejo más de tu compa AI:"));
    console.log(
      chalk.gray(
        `Uno de los objetivos de ${chalk.cyan(
          "ai-commit"
        )} es justamente ayudarte a mejorar la calidad de tus commits. 💎📈\n` +
          `Commits bien pensados no solo cuentan una mejor historia del código, sino que también\n` +
          `facilitan el debugging, los PRs y la colaboración con el equipo.\n\n` +
          `Si te parece bien, la próxima vez que termines una funcionalidad o cambio independiente,\n` +
          `probá correr directamente ${chalk.cyan(
            "ai-commit"
          )} apenas termines ese paso. 🧠⚡\n\n` +
          `Aunque hoy ${chalk.cyan(
            "ai-commit"
          )} puede sugerir múltiples commits separados por archivo o propósito general,\n` +
          `aún no puede detectar con precisión si hay más de una funcionalidad dentro del mismo archivo o bloque de código.\n` +
          `Eso requeriría un análisis más profundo del contexto funcional, algo que todavía estamos explorando. 🤖🔬\n\n` +
          `Por eso, cada vez que termines algo autocontenible, usá ${chalk.cyan(
            "ai-commit"
          )} y lo resolvemos en segundos. 🚀\n` +
          `¡Vos programás, yo comiteo! 😉`
      )
    );

    for (const grupo of groupedBlocks) {
      const resumen = await summarizeCommit(grupo, model, "es", isVerbose);
      summaries.push({ resumen, grupo });

      console.log(chalk.green.bold("\n🔹 Commit sugerido:"));
      console.log(chalk.cyan(resumen.title));
      console.log(resumen.content);
      console.log(chalk.gray(`📁 Archivos: ${resumen.files.join(", ")}`));
    }
    console.log("\n\n\n");
    // OPCIONES según cantidad de commits
    const opciones =
      summaries.length === 1
        ? [
            { name: "✅ Hacer commit", value: "single" },
            { name: "📋 Copiar mensaje al portapapeles", value: "copy" },
            { name: "❌ Cancelar", value: "cancel" },
          ]
        : [
            {
              name: "🔀 Hacer múltiples commits (uno por bloque funcional)",
              value: "multi",
            },
            {
              name: "🧷 Unificar todos los mensajes y hacer un solo commit",
              value: "unified",
            },
            {
              name: "📋 Copiar todos los mensajes al portapapeles",
              value: "copy",
            },
            { name: "❌ Cancelar", value: "cancel" },
          ];

    const { accion } = await inquirer.prompt([
      {
        type: "list",
        name: "accion",
        message: "¿Qué querés hacer con los commits sugeridos?",
        choices: opciones,
      },
    ]);

    if (accion === "cancel") {
      console.log(chalk.yellow("❌ Operación cancelada por el usuario."));
      return;
    }

    if (accion === "copy") {
      const texto = summaries
        .map((s) => `${s.resumen.title}\n\n${s.resumen.content}`)
        .join("\n\n");
      await clipboardy.write(texto);
      console.log(chalk.green("📋 Mensajes copiados al portapapeles."));
      return;
    }

    if (accion === "single") {
      const { title, content } = summaries[0].resumen;
      await commitWithMessage(`${title}\n\n${content}`);
      console.log(chalk.green("✅ Commit realizado con éxito."));
      return;
    }

    if (accion === "unified") {
      const all = summaries
        .map((s) => `${s.resumen.title}\n\n${s.resumen.content}`)
        .join("\n\n");
      await commitWithMessage(all);
      console.log(chalk.green("✅ Commit unificado realizado con éxito."));
      return;
    }

    if (accion === "multi") {
      await unstageAllChanges();
      for (const { resumen } of summaries) {
        const fullPaths = blocks
          .filter((b) => resumen.files.includes(path.basename(b.filePath)))
          .map((b) => b.filePath);

        await stageSpecificFiles(fullPaths);
        await commitWithMessage(`${resumen.title}\n\n${resumen.content}`);
        console.log(chalk.green(`✅ Commit realizado para: ${resumen.title}`));
      }
    }
  } catch (err) {
    console.error(chalk.red("❌ Error general en ejecución:"), err);
  }
}

main();
