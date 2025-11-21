import axios from "axios";
import inquirer from "inquirer";
import chalk from "chalk";
import { getAPIKey } from "./config.js";
import { t } from "./i18n.js";
import path from "path";
import fs from "fs-extra";
import { generateReducedTree } from "./generateProjectTree.js";
import { fetchModelsFromOpenRouter } from "../utils/fetchModels.js";

const DEFAULT_MODEL = "openai/gpt-4.1";
const REQUEST_TIMEOUT_MS = 20000;
const MAX_RETRIES = 2;

async function requestWithRetry(makeRequest) {
  let attempt = 0;
  let lastError;
  while (attempt <= MAX_RETRIES) {
    try {
      return await makeRequest();
    } catch (err) {
      lastError = err;
      attempt += 1;
      if (attempt > MAX_RETRIES) break;
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw lastError;
}

function buildChoices(models) {
  const result = [];

  models.forEach((m, i) => {
    result.push({
      name: chalk.bold.green(`${m.name}`) + chalk.gray(` (${m.price})`),
      value: m.name,
    });

    if ((i + 1) % 2 === 0) {
      result.push(new inquirer.Separator());
    }
  });

  return result;
}

export async function chooseModel(lang = "en", apiKeyFromCLI) {
  const apiKey = apiKeyFromCLI || (await getAPIKey());

  if (!apiKey) {
    throw new Error("Missing OpenRouter API key (OPENROUTER_API_KEY)");
  }

  let models = [];
  try {
    models = await fetchModelsFromOpenRouter(apiKey);
  } catch (err) {
    console.warn(chalk.yellow(t("errorFetchingModels", lang) || "Failed to fetch models"), err.message);
  }

  if (!models.length) {
    console.log(chalk.yellow(`Using default model ${DEFAULT_MODEL}`));
    return DEFAULT_MODEL;
  }

  const { model } = await inquirer.prompt([
    {
      type: "list",
      name: "model",
      message: t("chooseModel", lang),
      choices: buildChoices(models),
      loop: false,
      default: models.find((m) => m.name === DEFAULT_MODEL)?.name,
    },
  ]);

  return model;
}

export async function analyzeDiffBlock(
  diffBlock,
  model,
  filePath,
  verbose = false,
  lang = "en",
  apiKeyFromCLI
) {
  const apiKey = apiKeyFromCLI || (await getAPIKey());
  const absolutePath = path.join(process.cwd(), filePath);

  const isBinary =
    /GIT binary patch/i.test(diffBlock) ||
    /Binary files .* differ/i.test(diffBlock) ||
    /\nbinary mode /i.test(diffBlock);

  if (isBinary) {
    const filename = path.basename(filePath);
    return {
      title: "chore: binary asset updated",
      content: `### Changes in ${filename}\n- Binary asset touched. Diff skipped for analysis.`,
      filename,
      filePath,
      relatedFiles: [],
    };
  }

  const fileExists = await fs.pathExists(absolutePath);
  const fullFileContent = fileExists
    ? await fs.readFile(absolutePath, "utf-8")
    : "(File not found on disk; using diff context only)";

  const SYSTEM_CONTENT = `
You are a development assistant.

Analyze the provided code changes (diff) along with the full updated file content.

Return a JSON object with the following structure:

{
  "title": "type: short description",
  "content": "Markdown-formatted changelog-style summary",
  "filename": "file.js",
  "relatedFiles": ["relatedFile1.js", "relatedFile2.tsx"]
}

Guidelines:

- "title": A short Conventional Commit-style header describing the purpose of the changes.
- "content": A concise **Markdown-formatted summary** of the key functional changes in the file.
  - Use a title like: \`### Changes in [filename]\`
  - Use bullet points (\`- \`) to describe each meaningful change.
  - Each bullet should capture one logical change or idea.
  - **Do not list minor syntax changes or formatting adjustments.**
- "filename": Only the base file name (e.g., "app.jsx"), no path.

"relatedFiles": should include **all files** that are being imported **from the same project**, based on the full updated file content.

- This includes **every file** whose import path starts with "./" or "../", or any path that clearly belongs to the local project (e.g., aliases like "@/utils/file").
- Include them even if those files **were not modified** or don't appear in the diff.
- Do **not** include external dependencies such as React, lodash, or anything from "node_modules".

Additional Notes:

- Focus on the purpose of the change, not just what line changed.
- If multiple changes contribute to a single feature, group them under one bullet.
- Avoid repeating information already included in the title.
- Always return a valid JSON object, with no extra text or Markdown outside the object.

Example "content" field:

\`\`\`md
### Changes in analyzeWithLLM.js

- Added support for multilingual output using a \`lang\` parameter.
- Refactored analyzeDiffBlock to include full file context and verbose logging.
- Improved model prompt formatting for better accuracy.
\`\`\`
`;

  const messages = [
    {
      role: "system",
      content: SYSTEM_CONTENT,
    },
    {
      role: "user",
      content: `
## Affected file

\`${filePath}\`

---

## DIFF

\`\`\`diff
${diffBlock}
\`\`\`

---

## Full updated file content (use to extract relatedFiles)

\`\`\`tsx
${fullFileContent}
\`\`\`
`,
    },
  ];

  try {
    const response = await requestWithRetry(() =>
      axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "smart-commit-ia/1.0",
          },
          timeout: REQUEST_TIMEOUT_MS,
        }
      )
    );

    if (verbose) {
      console.log(chalk.gray(t("promptSent", lang)));
      console.dir(messages, { depth: null, colors: true });
    }

    const raw = response.data.choices[0]?.message?.content || "{}";
    try {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        filename: path.basename(filePath),
        filePath,
      };
    } catch (err) {
      console.error(chalk.red(`${t("errorParsingJSON", lang)}`), raw);
      return null;
    }
  } catch (error) {
    console.error(chalk.red(`${t("errorAnalyzeDiffBlock", lang)}`), error.message);
    return null;
  }
}

export async function analyzeDeletesBlocks(
  diffBlocks,
  model,
  verbose = false,
  lang = "en",
  apiKeyFromCLI
) {
  const apiKey = apiKeyFromCLI || (await getAPIKey());

  const SYSTEM_CONTENT = `
You are a development assistant.

You will be provided with a list of deleted files and metadata about whether any functions were moved elsewhere.

Return a single JSON object with the following structure:

{
  "title": "type: short description",
  "content": "Markdown-formatted changelog-style summary",
  "filename": "deleted_files_summary",
  "relatedFiles": ["relatedFile1.js", "relatedFile2.tsx"]
}

Guidelines:

- Use title like: "refactor: removed obsolete files and relocated functions".
- "content": Should be Markdown-formatted with a title and bullets for each file.
  - Start with: \`### Deleted files summary\`
  - Use bullets like:
    - Removed \`dashboard.jsx\`, moved \`Dashboard\` to \`src/diffValidator.js\`
    - Removed \`getGitDiff.js\` (no functions relocated)
- "relatedFiles": Include every file mentioned as a relocation target.
- Always return only valid JSON, no text outside it.
`;

  const messages = [
    {
      role: "system",
      content: SYSTEM_CONTENT,
    },
    {
      role: "user",
      content: `
You will be given a list of deleted file blocks.

Each block has the following fields:
- \`filePath\`: name of the file that was deleted.
- \`block\`: a short Markdown summary describing if the file was deleted and whether its functions were moved elsewhere.
- \`movedFunctions\`: a list of objects describing which functions were moved and where.

Your task is to:
- Write a concise changelog-style Markdown summary.
- Use bullet points.
- Group all the changes under the title: \`### Deleted files summary\`.
- Format each bullet as:
  \`- Removed [filename], moved [FunctionName] to [NewFile]\`
- If a file was deleted and **no functions were moved**, say:
  \`- Removed [filename] (no functions relocated)\`

Here's the input:

\`\`\`json
${JSON.stringify(diffBlocks, null, 2)}
\`\`\`
`,
    },
  ];

  try {
    const response = await requestWithRetry(() =>
      axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "smart-commit-ia/1.0",
          },
          timeout: REQUEST_TIMEOUT_MS,
        }
      )
    );

    if (verbose) {
      console.log(chalk.gray(t("promptSent", lang)));
      console.dir(messages, { depth: null, colors: true });
    }

    const raw = response.data.choices[0]?.message?.content || "{}";
    try {
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (err) {
      console.error(chalk.red(`${t("errorParsingJSON", lang)}`), raw);
      return null;
    }
  } catch (error) {
    console.error(chalk.red(`${t("errorAnalyzeDiffBlock", lang)}`), error.message);
    return null;
  }
}

export async function summarizeCommit(
  group,
  model,
  lang = "es",
  verbose = false,
  apiKeyFromCLI
) {
  const apiKey = apiKeyFromCLI || (await getAPIKey());
  const files = group.map((b) => b.filePath || b.filename);
  const tree = await generateReducedTree(files);

  const contentByFile = group
    .map((b) => `- ${b.filePath || b.filename}\n${b.content}`)
    .join("\n\n");

  const prompt = `
Respond in ${lang === "es" ? "Spanish" : "English"} only.

Project structure:
${tree}

Grouped changes:

${contentByFile}
`;

  const systemPrompt = `
You are a development assistant generating a single Conventional Commit message.

You will receive:
- A simplified project structure
- A list of modified files, with technical content in MD format summarizing their changes

Your goal:
- Generate a plain text commit message with:
  - "title": a short Conventional Commit-style header
  - "content": a list of technical bullets, one per meaningful change (not per file)
  - "files": a list of involved file paths (use the provided file paths, not just basenames)

RESPONSE FORMAT (mandatory):
{
  "title": "type: short summary",
  "content": "- bullet 1\\n- bullet 2",
  "files": ["path/to/file1.js", "path/to/file2.tsx"]
}

Do NOT include any extra text, markdown, or explanations. Return only a valid JSON object.
`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt },
  ];

  if (verbose) {
    console.log(chalk.gray(t("promptSent", lang)));
    console.dir(messages, { depth: null, colors: true });
  }

  try {
    const response = await requestWithRetry(() =>
      axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "smart-commit-ia/1.0",
          },
          timeout: REQUEST_TIMEOUT_MS,
        }
      )
    );

    const raw = response.data.choices[0]?.message?.content;
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      files,
    };
  } catch (err) {
    console.error(chalk.red(`${t("errorSummarizeGroup", lang)}`), err.message);
    return {
      title:
        lang === "en"
          ? "fix: failed to generate summary"
          : "fix: error al generar resumen",
      content:
        lang === "en"
          ? "- Could not generate summary automatically."
          : "- No se pudo generar el resumen automático.",
      files,
    };
  }
}
