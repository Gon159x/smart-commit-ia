import inquirer from "inquirer";
import { t } from "./i18n.js";

export async function promptCommitAction(summaries, lang = "en") {
  const opciones =
    summaries.length === 1
      ? [
          { name: t("optionCommit", lang), value: "single" },
          { name: t("optionCopy", lang), value: "copy" },
          { name: t("optionCancel", lang), value: "cancel" },
        ]
      : [
          {
            name: t("optionMultiple", lang),
            value: "multi",
          },
          {
            name: t("optionUnified", lang),
            value: "unified",
          },
          {
            name: t("optionCopyAll", lang),
            value: "copy",
          },
          { name: t("optionCancel", lang), value: "cancel" },
        ];

  const { accion } = await inquirer.prompt([
    {
      type: "list",
      name: "accion",
      message: t("commitPromptQuestion", lang),
      choices: opciones,
    },
  ]);

  return accion;
}

import clipboardy from "clipboardy";
import path from "path";
import {
  commitWithMessage,
  getGitStatus,
  stageSpecificFiles,
  unstageAllChanges,
} from "./gitHandler.js";
import { appendToChangelog } from "./changelogHandler.js";
import chalk from "chalk";

export async function performCommitActions(accion, summaries, blocks, lang = "en") {
  let huboCambiosEnChangelog = false;

  if (accion === "cancel") {
    console.log(chalk.yellow(t("operationCancelled", lang)));
    return;
  }

  if (accion === "copy") {
    const texto = summaries
      .map((s) => `${s.resumen.title}\n\n${s.resumen.content}`)
      .join("\n\n");
    await clipboardy.write(texto);
    console.log(chalk.green(t("messagesCopied", lang)));
    return;
  }

  if (accion === "single") {
    const { title, content } = summaries[0].resumen;
    const fullPaths = obtenerArchivosDesdeDiff([summaries[0]], blocks);

    await stageSpecificFiles(fullPaths, lang);
    await commitWithMessage(`${title}\n\n${content}`, lang);
    console.log(chalk.green(t("commitSuccess", lang)));

    try {
      await appendToChangelog(summaries[0].grupo, lang);
      console.log(chalk.gray(t("changelogEntryAdded", lang)));
      huboCambiosEnChangelog = true;
    } catch (error) {
      console.warn(
        chalk.yellow(`${t("changelogUpdateFail", lang)}`),
        error.message
      );
    }
  }

  if (accion === "unified") {
    const fullPaths = obtenerArchivosDesdeDiff(summaries, blocks);

    await stageSpecificFiles(fullPaths, lang);

    const all = summaries
      .map((s) => `${s.resumen.title}\n\n${s.resumen.content}`)
      .join("\n\n");

    await commitWithMessage(all, lang);
    console.log(chalk.green(t("unifiedCommitSuccess", lang)));

    try {
      const allGrupos = summaries.flatMap((s) => s.grupo);
      await appendToChangelog(allGrupos, lang);
      console.log(chalk.gray(t("changelogEntryAdded", lang)));
      huboCambiosEnChangelog = true;
    } catch (error) {
      console.warn(
        chalk.yellow(`${t("changelogUpdateFail", lang)}`),
        error.message
      );
    }
  }

  if (accion === "multi") {
    await unstageAllChanges();

    for (let i = 0; i < summaries.length; i++) {
      const { resumen, grupo } = summaries[i];

      // Usar helper para obtener los archivos relacionados
      const fullPaths = obtenerArchivosDesdeDiff([summaries[i]], blocks);

      await stageSpecificFiles(fullPaths, lang);
      await commitWithMessage(`${resumen.title}\n\n${resumen.content}`, lang);
      console.log(
        chalk.green(`${t("commitMadeFor", lang)} ${resumen.title}`)
      );

      try {
        if (grupo?.length) {
          await appendToChangelog(grupo, lang);
          console.log(chalk.gray(t("changelogEntryAdded", lang)));
          huboCambiosEnChangelog = true;
        }
      } catch (error) {
        console.warn(
          chalk.yellow(`${t("changelogUpdateFail", lang)}`),
          error.message
        );
      }
    }
  }

  // 🔚 Commit final de CHANGELOG (si hubo cambios)
  if (huboCambiosEnChangelog) {
    await commitChangelogIfChanged(lang);
  }
  return;
}

export async function commitChangelogIfChanged(lang = "en") {
  try {
    await stageSpecificFiles(["CHANGELOG.md"], lang);
    const status = await getGitStatus();
    const changelogModificado = status.staged.includes("CHANGELOG.md");

    if (changelogModificado) {
      await commitWithMessage("chore(changelog): actualizar CHANGELOG.md", lang);
      console.log(chalk.green(t("changelogCommit", lang)));
    } else {
      console.log(chalk.gray(t("noChangelogChanges", lang)));
    }
  } catch (error) {
    console.warn(
      chalk.yellow(`${t("changelogCommitFail", lang)}`),
      error.message
    );
  }
}

export function obtenerArchivosDesdeDiff(summaries, blocks) {
  const filePathSet = new Set();

  for (const block of blocks) {
    const perteneceAResumen = summaries.some((s) =>
      s.resumen.files.includes(block.filePath)
    );
    if (perteneceAResumen) {
      filePathSet.add(block.filePath);
    }

    // Renombramientos
    const renameFromMatch = block.block.match(/^rename from (.+)$/m);
    const renameToMatch = block.block.match(/^rename to (.+)$/m);
    if (renameFromMatch && renameToMatch) {
      filePathSet.add(renameFromMatch[1]);
      filePathSet.add(renameToMatch[1]);
    }

    // Archivos eliminados
    if (/^deleted file mode/m.test(block.block)) {
      const deletedFileMatch = block.block.match(/^--- a\/(.+)$/m);
      if (deletedFileMatch) {
        filePathSet.add(deletedFileMatch[1]);
      } else {
        filePathSet.add(block.filePath);
      }
    }
  }

  return Array.from(filePathSet);
}

