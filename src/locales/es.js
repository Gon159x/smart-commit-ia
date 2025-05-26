export default {
  apiKeyUsage: "🔐 Usando API Key: ",
  languageLabel: "🌐 Idioma",
  confirmAddChanges:
    "¿Querés agregar los últimos cambios al commit con `git add .`?",
  runningGitAdd: "📦 Ejecutando git add .",
  changesAdded: "✅ Cambios agregados.",
  suggestedCommit: "🔹 Commit sugerido:",
  files: "📁 Archivos:",
  helpTitle: "ℹ️  Ayuda de smart-commit-ia",
  helpDescription: "Comandos disponibles:",
  helpLang: "--lang [es|en]     Cambia el idioma de la interfaz",
  helpVerbose: "--verbose         Muestra logs detallados",
  helpHelp: "--help             Muestra este mensaje de ayuda",
  addingFiles: "Agregando archivos:",
  removingFiles: "Eliminando archivos:",
  stagingError: "Error al hacer staging:",
  gitAddError: "Error al hacer git add:",
  errorParsing: "❌ Error parseando",
  fileReadWarning: "⚠️ No se pudo leer el archivo:",
  analyzingDeleted: "🗑️ Analizando archivos eliminados/refactorizados...",
  deletedSummarySuccess: "🧾 Archivos eliminados/refactorizados resumidos",
  verboseDeletedSummary: "📚 Resumen de archivos eliminados/refactorizados:\n",
  errorProcessingDeleted: "❌ Error procesando archivos eliminados/refactorizados",
  analyzingFile: "🤖 Analizando {file} con IA...",
  fileProcessed: "📄 {file} procesado correctamente",
  verboseAnalyzeResponse: "📚 Respuesta de analyzeDiffBlock:\n",
  errorProcessingFile: "❌ Error al procesar {file}",
  gitAdviceTitle: "📚 Consejo Git:",
  gitAdviceText:
    "Se recomienda realizar un commit por cada cambio con responsabilidad única.\n" +
    "Esto mejora la trazabilidad, facilita el trabajo en equipo y el uso de herramientas como git bisect.\n",
  aiAdviceTitle: "🤝 Un consejo más de tu compa AI:",
  aiAdviceText:
    "Uno de los objetivos de {tool} es justamente ayudarte a mejorar la calidad de tus commits. 💎📈\n" +
    "Commits bien pensados no solo cuentan una mejor historia del código, sino que también\n" +
    "facilitan el debugging, los PRs y la colaboración con el equipo.\n\n" +
    "Si te parece bien, la próxima vez que termines una funcionalidad o cambio independiente,\n" +
    "probá correr directamente {tool} apenas termines ese paso. 🧠⚡\n\n" +
    "Aunque hoy {tool} puede sugerir múltiples commits separados por archivo o propósito general,\n" +
    "aún no puede detectar con precisión si hay más de una funcionalidad dentro del mismo archivo o bloque de código.\n" +
    "Eso requeriría un análisis más profundo del contexto funcional, algo que todavía estamos explorando. 🤖🔬\n\n" +
    "Por eso, cada vez que termines algo autocontenible, usá {tool} y lo resolvemos en segundos. 🚀\n" +
    "¡Vos programás, yo comiteo! 😉",
  chooseModel: "\n\n\n🧠 ¿Qué modelo LLM querés usar?",
  promptSent: "\n📤 Prompt enviada al modelo:\n",
  errorParsingJSON: "❌ Error parsing block JSON:",
  errorAnalyzeDiffBlock: "❌ Error in analyzeDiffBlock:",
  errorSummarizeGroup: "❌ Error al resumir grupo:",
  commitPromptQuestion: "¿Qué querés hacer con los commits sugeridos?",
  optionCommit: "✅ Hacer commit",
  optionCopy: "📋 Copiar mensaje al portapapeles",
  optionCancel: "❌ Cancelar",
  optionMultiple: "🔀 Hacer múltiples commits (uno por bloque funcional)",
  optionUnified: "🧷 Unificar todos los mensajes y hacer un solo commit",
  optionCopyAll: "📋 Copiar todos los mensajes al portapapeles",
  operationCancelled: "❌ Operación cancelada por el usuario.",
  messagesCopied: "📋 Mensajes copiados al portapapeles.",
  commitSuccess: "✅ Commit realizado con éxito.",
  changelogEntryAdded: "📘 Entrada de CHANGELOG agregada.",
  changelogUpdateFail: "⚠️  No se pudo actualizar el CHANGELOG:",
  unifiedCommitSuccess: "✅ Commit unificado realizado con éxito.",
  commitMadeFor: "✅ Commit realizado para:",
  changelogCommit: "📝 Commit del CHANGELOG realizado.",
  noChangelogChanges: "📘 No hubo cambios en CHANGELOG.md. No se hizo commit.",
  changelogCommitFail: "⚠️  No se pudo realizar el commit del CHANGELOG:",
  noStagedChanges: "⚠️  No se encontraron cambios en staging.",
  useGitAdd: "Usa `git add <file>` para agregar cambios.",
  fullDiff: "\n🔍 Diff completo:\n",
  functionsMoved: "función(es) movida(s):\n",
  refactorSummary: "Resumen de refactor:\n",
  artificialBlocks: "\n🧱 Bloques artificiales:",
  removedBlocksInfo:
    "Se eliminaron {count} bloque(s) eliminado(s) original(es) en favor de versiones artificiales.",
  changelogUpdated: "📝 CHANGELOG.md actualizado con los cambios.",
  apiKeyPrompt: "🔑 Ingresá tu OpenRouter API Key:",
  apiKeyEmpty: "La API Key no puede estar vacía.",
  selectLanguage: "Seleccioná el idioma para la interfaz:",
  pressEnter: "Presioná ENTER para continuar...",
}; 
