import path from "path";

export function generateReducedTree(filePaths) {
  const uniqueDirs = new Set();

  filePaths.forEach((filePath) => {
    const parts = filePath.split(path.sep);
    for (let i = 1; i < parts.length; i++) {
      const dir = parts.slice(0, i).join("/");
      uniqueDirs.add(dir);
    }
  });

  const entries = [...uniqueDirs, ...filePaths]
    .sort((a, b) => a.localeCompare(b, "en"))
    .map((p) => (p.includes(".") ? `- ${p}` : `> ${p}`));

  return entries.map((entry) => `* ${entry}`).join("\n");
}
