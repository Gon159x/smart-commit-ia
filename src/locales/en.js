export default {
  apiKeyUsage: "🔐 Using API Key: ",
  languageLabel: "🌐 Language",
  confirmAddChanges:
    "Do you want to add the latest changes to the commit with `git add .`?",
  runningGitAdd: "📦 Running git add .",
  changesAdded: "✅ Changes added.",
  suggestedCommit: "🔹 Suggested commit:",
  files: "📁 Files:",
  helpTitle: "ℹ️  smart-commit-ia Help",
  helpDescription: "Available commands:",
  helpLang: "--lang [es|en]     Change interface language",
  helpVerbose: "--verbose         Show detailed logs",
  helpHelp: "--help             Display this help message",
  addingFiles: "Adding files:",
  removingFiles: "Removing files:",
  stagingError: "Error staging files:",
  gitAddError: "Error running git add:",
  errorParsing: "❌ Error parsing",
  fileReadWarning: "⚠️ Could not read file:",
  analyzingDeleted: "🗑️ Analyzing deleted/refactored files...",
  deletedSummarySuccess: "🧾 Deleted/refactored files summarized",
  verboseDeletedSummary: "📚 Summary for deleted/refactored files:\n",
  errorProcessingDeleted: "❌ Error processing deleted/refactored files",
  analyzingFile: "🤖 Analyzing {file} with AI...",
  fileProcessed: "📄 {file} processed successfully",
  verboseAnalyzeResponse: "📚 analyzeDiffBlock response:\n",
  errorProcessingFile: "❌ Error processing {file}",
  gitAdviceTitle: "📚 Git advice:",
  gitAdviceText:
    "It is recommended to make one commit per change with a single responsibility.\n" +
    "This improves traceability, teamwork and tools like git bisect.\n",
  aiAdviceTitle: "🤝 One more tip from your AI buddy:",
  aiAdviceText:
    "One of the goals of {tool} is to help you improve the quality of your commits. 💎📈\n" +
    "Well crafted commits not only tell a better story of the code, but also\n" +
    "make debugging, PRs and team collaboration easier.\n\n" +
    "If you agree, next time you finish an independent feature or change,\n" +
    "try running {tool} right after that step. 🧠⚡\n\n" +
    "Although today {tool} can suggest multiple commits separated by file or general purpose,\n" +
    "it still can't accurately detect if there's more than one feature inside the same file or block.\n" +
    "That would require a deeper functional context analysis, something we're still exploring. 🤖🔬\n\n" +
    "So whenever you finish something self-contained, use {tool} and we'll solve it in seconds. 🚀\n" +
    "You code, I commit! 😉",
  chooseModel: "\n\n\n🧠 Which LLM model do you want to use?",
  promptSent: "\n📤 Prompt sent to model:\n",
  errorParsingJSON: "❌ Error parsing block JSON:",
  errorAnalyzeDiffBlock: "❌ Error in analyzeDiffBlock:",
  errorSummarizeGroup: "❌ Error summarizing group:",
  commitPromptQuestion: "What do you want to do with the suggested commits?",
  optionCommit: "✅ Make commit",
  optionCopy: "📋 Copy message to clipboard",
  optionCancel: "❌ Cancel",
  optionMultiple: "🔀 Make multiple commits (one per functional block)",
  optionUnified: "🧷 Combine all messages and make a single commit",
  optionCopyAll: "📋 Copy all messages to clipboard",
  operationCancelled: "❌ Operation cancelled by user.",
  messagesCopied: "📋 Messages copied to clipboard.",
  commitSuccess: "✅ Commit completed successfully.",
  changelogEntryAdded: "📘 CHANGELOG entry added.",
  changelogUpdateFail: "⚠️  Could not update CHANGELOG:",
  unifiedCommitSuccess: "✅ Unified commit completed successfully.",
  commitMadeFor: "✅ Commit made for:",
  changelogCommit: "📝 CHANGELOG commit created.",
  noChangelogChanges: "📘 No changes in CHANGELOG.md. No commit made.",
  changelogCommitFail: "⚠️  Could not commit CHANGELOG:",
  noStagedChanges: "⚠️  No staged changes found.",
  useGitAdd: "Use `git add <file>` to stage changes.",
  fullDiff: "\n🔍 Full diff:\n",
  functionsMoved: "function(s) moved:\n",
  refactorSummary: "Refactor summary:\n",
  artificialBlocks: "\n🧱 Artificial blocks:",
  removedBlocksInfo:
    "Removed {count} original deleted block(s) in favor of artificial versions.",
  changelogUpdated: "📝 CHANGELOG.md updated with changes.",
  apiKeyPrompt: "🔑 Enter your OpenRouter API Key:",
  apiKeyEmpty: "API Key cannot be empty.",
  selectLanguage: "Select interface language:",
  pressEnter: "Press ENTER to continue...",
};
