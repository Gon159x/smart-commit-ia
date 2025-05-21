import ora from "ora";
import chalk from "chalk";
import path from "path";
import { analyzeDiffBlock, analyzeDeletesBlocks } from "./analyzeWithLLM.js";

export async function analyzeBlocksWithIA(
  blocks,
  model,
  isVerbose,
  removedBlocks = []
) {
  const parsedBlocks = [];

  if (removedBlocks.length > 0) {
    const spinner = ora(
      "🗑️ Analizando archivos eliminados/refactorizados..."
    ).start();
    try {
      const result = await analyzeDeletesBlocks(
        removedBlocks,
        model,

        isVerbose
      );
      spinner.succeed("🧾 Deleted/refactored files summarized");

      const relatedFiles = Array.from(
        new Set(
          removedBlocks.flatMap((b) =>
            (b.movedFunctions || []).map((f) => path.basename(f.newFile))
          )
        )
      );

      const parsed = {
        title: result.title,
        content: result.content,
        filename: "deleted_files_summary",
        relatedFiles,
      };

      parsedBlocks.push(parsed);

      if (isVerbose) {
        console.log(
          chalk.blueBright("\n📚 Summary for deleted/refactored files:\n")
        );
        console.dir(result, { depth: null, colors: true });
      }
    } catch (err) {
      spinner.fail("❌ Error processing deleted/refactored files");
      console.error(err);
    }
  }

  for (const { filePath, block } of blocks) {
    const spinner = ora(`🤖 Analizando ${filePath} con IA...`).start();
    try {
      const result = await analyzeDiffBlock(block, model, filePath, isVerbose);
      spinner.succeed(`📄 ${filePath} procesado correctamente`);

      const parsed = {
        title: result.title,
        content: result.content,
        filename: path.basename(filePath),
        relatedFiles: result.relatedFiles || [],
      };

      parsedBlocks.push(parsed);

      if (isVerbose) {
        console.log(chalk.blueBright("\n📚 Respuesta de analyzeDiffBlock:\n"));
        console.dir(result, { depth: null, colors: true });
      }
    } catch (err) {
      spinner.fail(`❌ Error al procesar ${filePath}`);
      console.error(err);
    }
  }

  return { parsedBlocks };
}

export function printGitAdviceIfNeeded(groupedBlocks) {
  if (groupedBlocks.length <= 1) return;

  console.log(chalk.blueBright("\n📚 Consejo Git:"));
  console.log(
    chalk.gray(
      `Se recomienda realizar un commit por cada cambio con responsabilidad única.\n` +
        `Esto mejora la trazabilidad, facilita el trabajo en equipo y el uso de herramientas como git bisect.\n`
    )
  );

  console.log(chalk.blueBright("\n🤝 Un consejo más de tu compa AI:"));
  console.log(
    chalk.gray(
      `Uno de los objetivos de ${chalk.cyan(
        "ai-commit"
      )} es justamente ayudarte a mejorar la calidad de tus commits. 💎📈\n` +
        `Commits bien pensados no solo cuentan una mejor historia del código, sino que también\n` +
        `facilitan el debugging, los PRs y la colaboración con el equipo.\n\n` +
        `Si te parece bien, la próxima vez que termines una funcionalidad o cambio independiente,\n` +
        `probá correr directamente ${chalk.cyan(
          "ai-commit"
        )} apenas termines ese paso. 🧠⚡\n\n` +
        `Aunque hoy ${chalk.cyan(
          "ai-commit"
        )} puede sugerir múltiples commits separados por archivo o propósito general,\n` +
        `aún no puede detectar con precisión si hay más de una funcionalidad dentro del mismo archivo o bloque de código.\n` +
        `Eso requeriría un análisis más profundo del contexto funcional, algo que todavía estamos explorando. 🤖🔬\n\n` +
        `Por eso, cada vez que termines algo autocontenible, usá ${chalk.cyan(
          "ai-commit"
        )} y lo resolvemos en segundos. 🚀\n` +
        `¡Vos programás, yo comiteo! 😉`
    )
  );
}
