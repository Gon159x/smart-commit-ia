import simpleGit from "simple-git";
const git = simpleGit();
import fs from "fs-extra";

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

export async function stageSpecificFiles(files) {
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
      console.log("Agregando archivos:", toAdd);
      await git.add(toAdd);
    }
    if (toRemove.length > 0) {
      console.log("Eliminando archivos:", toRemove);
      await git.rm(toRemove);
    }
  } catch (err) {
    console.error("Error al hacer staging:", err);
    throw new Error(`No se pudo hacer staging de archivos: ${err.message}`);
  }
}

export async function commitWithMessage(message) {
  try {
    await git.commit(message);
  } catch (err) {
    console.error("Error al hacer git add:", err);

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
