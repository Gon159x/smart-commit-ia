import axios from "axios";
import inquirer from "inquirer";
import chalk from "chalk";
import { getAPIKey } from "./config.js";
import path from "path";
import fs from "fs-extra";
import { generateReducedTree } from "./generateProjectTree.js";

// Modelos disponibles (pueden crecer en el futuro)
const models = [
  { name: "openai/gpt-3.5-turbo", price: "$0.50 / 1M", maxTokens: 4096 },
  { name: "openai/gpt-4", price: "$10 / 1M", maxTokens: 8192 },
  {
    name: "openai/gpt-4.1-nano",
    price: "$0.10 / 1M input — $0.40 / 1M output",
    maxTokens: 1047576,
  },
  {
    name: "openai/gpt-4.1",
    price: "$2 / 1M input — $8 / 1M output",
    maxTokens: 1047576,
  },
  { name: "mistral/mistral-7b-instruct", price: "$0.15 / 1M", maxTokens: 4000 },
  { name: "anthropic/claude-3-sonnet", price: "$3 / 1M", maxTokens: 100000 },
];

export async function chooseModel() {
  const { model } = await inquirer.prompt([
    {
      type: "list",
      name: "model",
      message: "🧠 ¿Qué modelo LLM querés usar?",
      choices: models.map((m) => ({
        name: `${m.name} (${m.price})`,
        value: m.name,
      })),
    },
  ]);
  return model;
}

export async function analyzeDiffBlock(
  diffBlock,
  model,
  filePath,
  verbose = false
) {
  const apiKey = await getAPIKey();
  const absolutePath = path.join(process.cwd(), filePath);
  const fullFileContent = await fs.readFile(absolutePath, "utf-8");

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
**IMPORTANT**

"relatedFiles": should include **all files** that are being imported **from the same project**, based on the full updated file content.

- This includes **every file** whose import path starts with "./" or "../", or any path that clearly belongs to the local project (e.g., aliases like "@/utils/file").
- Include them even if those files **were not modified** or don't appear in the diff.
- Do **not** include external dependencies such as React, lodash, or anything from "node_modules", 

Additional Notes:

- Focus on the *purpose* of the change, not just *what line changed*.
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
## 📄 Affected file

\`${filePath}\`

---

## 🧾 DIFF

\`\`\`diff
${diffBlock}
\`\`\`

---

## 💾 Full updated file content(*IMPORTANT*:**Remember to include in the relatedFiles output all the files wich are being imported here and belongs to the proyect but only the filename witouth the path** )

\`\`\`tsx
${fullFileContent}
\`\`\`
`,
    },
  ];

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (verbose) {
      console.log(chalk.gray("\n📤 Prompt enviada al modelo:\n"));
      console.dir(messages, { depth: null, colors: true });
    }

    const raw = response.data.choices[0]?.message?.content || "{}";
    try {
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (err) {
      console.error(chalk.red("❌ Error parsing block JSON:"), raw);
      return null;
    }
  } catch (error) {
    console.error(chalk.red("❌ Error in analyzeDiffBlock:"), error.message);
    return "⚠️ Error analyzing diff.";
  }
}

export async function summarizeCommit(
  group,
  model,
  lang = "es",
  verbose = false
) {
  const apiKey = await getAPIKey();
  const files = group.map((b) => b.filename);
  const tree = await generateReducedTree(files);

  const contentByFile = group
    .map((b) => `📄 ${b.filename}\n${b.content}`)
    .join("\n\n");

  const prompt = `
Respond in ${lang === "es" ? "Spanish" : "English"} only.

📁 Project structure:
${tree}

🗂️ Grouped changes:

${contentByFile}
`;

  const systemPrompt = `
You are a development assistant generating a single Conventional Commit message.

You will receive:
- A simplified project structure
- A list of modified files, with technical content in MD format summarizing their changes

Your goal:
- Generate a plante text commit message with:
  - "title": a short Conventional Commit-style header
  - "content": a list of technical bullets, one per meaningful change (not per file)
  - "files": a list of involved filenames (only names, no paths)

RESPONSE FORMAT (mandatory):
{
  "title": "type: short summary",
  "content": "- bullet 1\\n- bullet 2",
  "files": ["file1.js", "file2.tsx"]
}

⚠️ Do NOT include any extra text, markdown, or explanations. Return only a valid JSON object.
`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt },
  ];

  if (verbose) {
    console.log(chalk.gray("\n📤 Prompt enviado al modelo:\n"));
    console.dir(messages, { depth: null, colors: true });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data.choices[0]?.message?.content;
    return JSON.parse(raw);
  } catch (err) {
    console.error(chalk.red("❌ Error al resumir grupo:"), err.message);
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
