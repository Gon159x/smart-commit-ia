import inquirer from "inquirer";

export async function promptCommitAction(summaries) {
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

  return accion;
}

import clipboardy from "clipboardy";
import path from "path";
import { execSync } from "child_process";
import {
  commitWithMessage,
  getGitStatus,
  stageSpecificFiles,
  unstageAllChanges,
} from "./gitHandler.js";
import { appendToChangelog } from "./changelogHandler.js";
import chalk from "chalk";

export async function performCommitActions(accion, summaries, blocks) {
  let huboCambiosEnChangelog = false;

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

    try {
      await appendToChangelog(summaries[0].grupo);
      console.log(chalk.gray("📘 Entrada de CHANGELOG agregada."));
      huboCambiosEnChangelog = true;
    } catch (error) {
      console.warn(
        chalk.yellow("⚠️  No se pudo actualizar el CHANGELOG:"),
        error.message
      );
    }
  }

  if (accion === "unified") {
    const all = summaries
      .map((s) => `${s.resumen.title}\n\n${s.resumen.content}`)
      .join("\n\n");
    await commitWithMessage(all);
    console.log(chalk.green("✅ Commit unificado realizado con éxito."));

    try {
      const allGrupos = summaries.flatMap((s) => s.grupo);
      await appendToChangelog(allGrupos);
      console.log(chalk.gray("📘 Entrada de CHANGELOG agregada."));
      huboCambiosEnChangelog = true;
    } catch (error) {
      console.warn(
        chalk.yellow("⚠️  No se pudo actualizar el CHANGELOG:"),
        error.message
      );
    }
  }

  if (accion === "multi") {
    await unstageAllChanges();

    for (let i = 0; i < summaries.length; i++) {
      const { resumen, grupo } = summaries[i];

      console.log("Blocks----->", blocks);
      console.log("Resumen----->", resumen);

      const fullPaths = blocks
        .filter((b) => resumen.files.includes(path.basename(b.filePath)))
        .map((b) => b.filePath);

      await stageSpecificFiles(fullPaths);
      await commitWithMessage(`${resumen.title}\n\n${resumen.content}`);
      console.log(chalk.green(`✅ Commit realizado para: ${resumen.title}`));

      try {
        if (grupo?.length) {
          await appendToChangelog(grupo);
          console.log(chalk.gray("📘 Entrada de CHANGELOG agregada."));
          huboCambiosEnChangelog = true;
        }
      } catch (error) {
        console.warn(
          chalk.yellow("⚠️  No se pudo actualizar el CHANGELOG:"),
          error.message
        );
      }
    }
  }

  // 🔚 Commit final de CHANGELOG (si hubo cambios)
  if (huboCambiosEnChangelog) {
    await commitChangelogIfChanged();
  }
  return;
}

export async function commitChangelogIfChanged() {
  try {
    await stageSpecificFiles(["CHANGELOG.md"]);
    const status = await getGitStatus();
    const changelogModificado = status.staged.includes("CHANGELOG.md");

    if (changelogModificado) {
      await commitWithMessage("chore(changelog): actualizar CHANGELOG.md");
      console.log(chalk.green("📝 Commit del CHANGELOG realizado."));
    } else {
      console.log(
        chalk.gray("📘 No hubo cambios en CHANGELOG.md. No se hizo commit.")
      );
    }
  } catch (error) {
    console.warn(
      chalk.yellow("⚠️  No se pudo realizar el commit del CHANGELOG:"),
      error.message
    );
  }
}
