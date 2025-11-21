import fs from "fs/promises";
import { existsSync } from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { t } from "./i18n.js";

export async function appendToChangelog(blocks, lang = "en") {
  const changelogPath = "CHANGELOG.md";
  const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  const commit = execSync("git rev-parse HEAD").toString().trim().slice(0, 7);
  const date = new Date().toISOString().split("T")[0];

  let changelogEntry = `\n---\n\n## [${branch}] - ${date}\n\n### Commit: ${commit}\n`;

  for (const block of blocks) {
    const label = block.filePath || block.filename;
    changelogEntry += `\n#### ${label}\n${block.content}\n`;
    if (block.relatedFiles?.length) {
      changelogEntry += `\nRelated: ${block.relatedFiles.join(", ")}\n`;
    }
  }

  changelogEntry += "\n---\n";

  if (!existsSync(changelogPath)) {
    await fs.writeFile(changelogPath, `# CHANGELOG\n${changelogEntry}`);
  } else {
    await fs.appendFile(changelogPath, changelogEntry);
  }

  console.log(chalk.green(t("changelogUpdated", lang)));
}
