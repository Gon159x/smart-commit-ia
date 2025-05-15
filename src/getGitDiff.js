import simpleGit from "simple-git";

export async function getGitDiff() {
  const git = simpleGit();
  try {
    const diff = await git.diff(["--cached"]); // Solo staged changes
    return diff;
  } catch (err) {
    throw new Error("No se pudo obtener el git diff.");
  }
}
