import simpleGit from "simple-git";
const git = simpleGit();
import fs from "fs-extra";
import { t } from "./i18n.js";

export async function getGitDiff() {
  try {
    return await git.diff(["--cached"]);
  } catch (err) {
    throw new Error("No se pudo obtener el git diff.", err);
  }
}

export async function stageAllChanges() {
  try {
    await git.add(".");
  } catch (err) {
    throw new Error("No se pudo ejecutar git add .", err);
  }
}

export async function unstageAllChanges() {
  try {
    await git.reset(["HEAD"]);
  } catch (err) {
    throw new Error("No se pudo deshacer git add.", err);
  }
}

export async function stageSpecificFiles(files, lang = "en") {
  const toAdd = [];
  const toRemove = [];

  for (const file of files) {
    try {
      await fs.access(file); // Verifica si el archivo existe
      toAdd.push(file);
    } catch {
      toRemove.push(file); // No existe = fue eliminado
    }
  }

  try {
    if (toAdd.length > 0) {
      console.log(`${t("addingFiles", lang)}`, toAdd);
      await git.add(toAdd);
    }
    if (toRemove.length > 0) {
      console.log(`${t("removingFiles", lang)}`, toRemove);
      await git.rm(toRemove);
    }
  } catch (err) {
    console.error(`${t("stagingError", lang)}`, err);
    throw new Error(`No se pudo hacer staging de archivos: ${err.message}`);
  }
}

export async function commitWithMessage(message, lang = "en") {
  try {
    await git.commit(message);
  } catch (err) {
    console.error(`${t("gitAddError", lang)}`, err);

    throw new Error(
      `No se pudo hacer git add para archivos específicos: ${err.message}`
    );
  }
}

export async function getGitStatus() {
  try {
    return await git.status();
  } catch (err) {
    throw new Error("No se pudo obtener el estado de git.", err);
  }
}
