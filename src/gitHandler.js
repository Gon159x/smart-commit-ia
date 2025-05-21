import simpleGit from "simple-git";
const git = simpleGit();
import fs from "fs-extra";
import { execSync } from "child_process";

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

export function stageSpecificFiles(files) {
  files.forEach((file) => {
    try {
      // Si el archivo existe, se agrega normalmente
      if (fs.existsSync(file)) {
        execSync(`git add "${file}"`);
      } else {
        // Si no existe, puede ser un archivo eliminado → igual se puede agregar
        execSync(`git rm --cached "${file}"`);
      }
    } catch (e) {
      console.warn(
        `⚠️ No se pudo agregar o eliminar el archivo: ${file}. Error:`,
        e
      );
    }
  });
}

export async function commitWithMessage(message) {
  try {
    await git.commit(message);
  } catch (err) {
    throw new Error("No se pudo hacer el commit.", err);
  }
}

export async function getGitStatus() {
  try {
    return await git.status();
  } catch (err) {
    throw new Error("No se pudo obtener el estado de git.", err);
  }
}
