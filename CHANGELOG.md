---

## [dev] - 2025-05-21

### Commit: 50a1494

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Removed multiple console.log statements used for debugging within the performCommitActions function, cleaning up the implementation.
- The core logic and workflow for handling commit actions (single, unified, multi) remains unchanged.
- No modifications were made to the file's functionality or structure, only debugging output removal.

Related: gitHandler.js, changelogHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js

- Removed the debug `console.log` statement in the `stageSpecificFiles` function to clean up the code.
- The function now strictly manages staging files without console output, improving maintainability.
- Confirmed the core functionality for checking file existence and staging/unstaging files remains intact.

Related: fs, simpleGit

---

---

## [dev] - 2025-05-21

### Commit: 78fc98c

#### 📄 testingFile.js

### Changes in testingFile.js

- Added a new function `readyToUse` that returns the number 32.
- The function is defined as an arrow function and exported as a constant.

This file now includes a simple utility function, potentially for reuse in other parts of the project.

---

---

## [dev] - 2025-05-21

### Commit: defe45c

#### 📄 deleted_files_summary

### Deleted files summary

- Removed testingFile.js, moved readyToUse to utils/fetchModels.js

Related: fetchModels.js

#### 📄 fetchModels.js

### Changes in fetchModels.js

- Introduced a new function `readyToUse` that returns the constant value 32.

This function is likely intended for future use or configuration purposes, but currently only returns a fixed number.

The existing functions for fetching and processing model data remain unchanged and are kept intact.

Related: fetchModels.js

---

---

## [dev] - 2025-05-21

### Commit: bf760fc

#### 📄 anotherFile.js

### Changes in anotherFile.js

- Introduced a new function `anotherVariable` that returns the string "hola mundo".

---

---

## [dev] - 2025-05-21

### Commit: d719ee5

#### 📄 deleted_files_summary

### Deleted files summary

- Removed `anotherFile.js` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: 040902b

#### 📄 fetchModels.js

### Changes in fetchModels.js

- Introduced the asynchronous function `fetchModelsFromOpenRouter` to fetch model data from the OpenRouter API, with support for filtering, sorting, and selecting the most cost-efficient models.
- Removed the previously defined `readyToUse` function, possibly indicating a refactor or change in initialization logic.
- Added helper functions `formatPrice` to format the pricing information and `parsePrice` to compute the total cost from prompt and completion prices.
- Implemented logic to ensure essential models are always included and combined with top N cheapest models, removing duplicates before returning the dataset.

Related: fetchModels.js

---

---

---

## [dev] - 2025-11-21

### Commit: f00f816

#### 📄 checks.md
### Changes in checks.md

- Introduced a strategy to map all imports to relational blocks statically where possible, and to review the complete import tree to better relate blocks based on dependencies and improve AI responses.
- Proposed adding a new prompt that includes all final commits to help the AI identify relationships between commits and cluster or connect them, effectively adding a layer of refinement.

---

- Roadmap additions:
  - Add language support.
  - Address the free tier issue (noted as currently flawed) and plan improvements.
  - Allow users to supply prompting to improve commit messages and get explanations for changes.
  - Extend ignore rules to cover additional languages or frameworks.
  - Publish the project to npm.
  - Consider marketing efforts (e.g., LinkedIn advertising).


---

---

## [dev] - 2025-11-21

### Commit: 3ab8103

#### 📄 fetchModels.js
### Changes in fetchModels.js

- Added openai/gpt-5-nano to the alwaysInclude list so this model is always considered among the curated models, alongside existing ones like gpt-4.1-nano, gpt-4.1, gpt-3.5-turbo, and gpt-4.
- No behavioral changes to the selection/merging logic; it still combines must-have models with the cheapest topN models and de-duplicates by name.


---

---

## [dev] - 2025-11-21

### Commit: b53444f

#### 📄 analyzeFlow.js
### Changes in analyzeFlow.js

- Add interactive handling for large diffs via a threshold (LARGE_DIFF_LINE_THRESHOLD) and an inquirer prompt (askForLargeDiffHandling) to choose between analyzing, noting, or skipping.
- Implement binary asset summarization for binary file changes with buildBinarySummary and integrate it into the analysis flow so binary files are summarized without diff analysis.
- Introduce a dedicated large-diff placeholder builder (buildLargeDiffPlaceholder) to generate a summary entry when a user chooses to note a large diff.
- Enhance analyzeBlocksWithIA to process blockInfo objects, gracefully handle binary files and large diffs, and compute diff line counts using lineCount when provided or by counting lines in the block.
- Adapt multilingual support by threading lang through prompts and messages (using t from i18n.js).
- Maintain existing deleted-block handling and add relatedFiles extraction from removed blocks.
- Ensure non-binary, small-diff files continue to be analyzed via analyzeDiffBlock with verbose logging.

Related: analyzeWithLLM.js, i18n.js

#### 📄 analyzeWithLLM.js
### Changes in analyzeWithLLM.js
- Binary asset updated. Diff skipped.

#### 📄 codeHandler.js
### Changes in codeHandler.js
- Binary asset updated. Diff skipped.

#### 📄 diffValidator.js
### Changes in diffValidator.js

- Exclude binary diff blocks from deletion and non-deletion categories when calculating moved function summaries. This is achieved by filtering on isBinary in addition to wasDeleted.
- As a result, binary changes (e.g., images) won't be treated as deletions or potential function relocations, improving accuracy of moved/refactor detection.

Related: gitHandler.js, codeHandler.js, i18n.js

---

---

## [dev] - 2025-11-21

### Commit: b75290f

#### 📄 en.js
### Changes in en.js

- Introduced new localization keys to support large-diff workflow:
  - largeDiffPrompt: prompts user how to proceed for a large diff.
  - largeDiffAnalyze: label for analyzing large diffs with AI (may take time/tokens).
  - largeDiffSkipWithNote: option to skip analysis but add a simple note.
  - largeDiffSkip: option to skip analysis and ignore the file.
  - binaryFileSkipped: message displayed when a binary file is detected and skipped.
  - largeDiffSkipped: confirmation message when skipping large diff per user choice.
  - largeDiffNoted: confirmation that a placeholder note was added for the large diff.

- These updates extend the English locale to support UX around large diffs; no runtime logic changes.


---

---

## [dev] - 2025-11-21

### Commit: f7b2847

#### 📄 es.js
### Changes in es.js

- Updated icons and wording for several status messages to improve UI feedback (e.g., apiKeyUsage icon changed from 🔐 to 🔑, suggestedCommit/iconography updated, and files label standardized to 📄).
- Refined analysis and error messaging for deletion/refactor scenarios (analyzingDeleted, deletedSummarySuccess, verboseDeletedSummary, errorProcessingDeleted) with updated icons to convey status more clearly.
- Improved per-file IA processing messages and prompts for consistency (analyzingFile, fileProcessed, verboseAnalyzeResponse, errorProcessingFile) and updated Git/AI advisory labels (gitAdviceTitle, aiAdviceTitle).
- Enhanced prompt and JSON parsing prompts to align with Spanish terminology and emojis (chooseModel, promptSent, errorParsingJSON, errorAnalyzeDiffBlock, errorSummarizeGroup).
- Added support for large-diff workflow with new prompts and actions (largeDiffPrompt, largeDiffAnalyze, largeDiffSkipWithNote, largeDiffSkip, binaryFileSkipped, largeDiffSkipped, largeDiffNoted).
- Updated changelog-related messaging to reflect changes (changelogEntryAdded, changelogUpdateFail, changelogCommit, noChangelogChanges, changelogCommitFail, changelogUpdated).
- General consistency and clarity improvements across UI strings, including diff labeling (fullDiff), artificial blocks indicator (artificialBlocks), and related user prompts.

---

---

## [dev] - 2025-11-21

### Commit: f01ca7c

#### 📄 demo copy.gif
### Changes in demo copy.gif
- Binary asset updated. Diff skipped.

---

---

## [muchas-mejoras] - 2025-11-21

### Commit: 3a50a28

#### package.json
### Changes in package.json

- Replaced the placeholder test script with a real test runner by using `node --test`.
- No other changes to scripts or dependencies.


---

---

## [muchas-mejoras] - 2025-11-21

### Commit: f38bc77

#### bin/index.js
### Changes in index.js

- Extend summarizeCommits to receive and pass through apiKey to summarizeCommit, and render detailed summary (title, content, and files) for each grouped block.
- Retrieve apiKey from CLI in main() and propagate it through the workflow to modeling and analysis steps.
- Update chooseModel to accept apiKey and pass it to analyzeBlocksWithIA.
- Update analyzeBlocksWithIA call to include apiKey for remote model analysis context.
- Update summarizeCommits invocation to pass apiKey so per-block summaries can be enriched with API access.
- Add early guard after diff validation to exit early when no valid diff result is returned.



Related: cliSetup.js, src/diffValidator.js, src/analyzeWithLLM.js, src/analyzeFlow.js, src/codeHandler.js, src/commitFlow.js, i18n.js

#### src/analyzeFlow.js
### Changes in analyzeFlow.js

- Added a concurrency-limited task runner and a dynamic concurrency value (CONCURRENCY) derived from AI_COMMIT_CONCURRENCY or defaulting to 3, enabling parallel analysis of blocks.
- Reordered and clarified imports to reflect new concurrency and analysis flow dependencies.
- Introduced new progress visualization for file analysis, with per-file status tracking (running, done, skipped, pending, error) and a summary line showing completed/total blocks.
- Implemented a robust per-block processing loop using a limiter and Promise.all, replacing the previous in-sequence processing model.
- Added support for binary assets by returning a binary summary object that includes filePath and enabling verbose logging for binary assets.
- Implemented large diff handling: a threshold (LARGE_DIFF_LINE_THRESHOLD) triggers a user prompt with options to analyze, note (place a placeholder), or skip; integrates progress rendering around user decisions.
- Enhanced removed-blocks handling by leveraging analyzeDeletesBlocks and emitting a deleted_files_summary entry with proper filePath and resolved relatedFiles.
- Strengthened per-file analysis results: each parsed block now includes filePath, filename (basename), and resolved relatedFiles, derived from analyzeDiffBlock results.
- Enabled API key propagation for diff analysis by passing apiKey through to analyzeDiffBlock calls.
- Implemented related-files resolution logic to map base file names to their full path when there is a single match, improving cross-file references.
- Extended parser utilities to attach filePath to binary and placeholder entries, ensuring consistent downstream handling.
- Minor formatting cleanup for git-advice output to maintain consistent messaging across languages.


Related: src/analyzeWithLLM.js, i18n.js

#### src/changelogHandler.js
### Changes in changelogHandler.js

- Use a label derived from block.filePath when provided, else block.filename, for the block header displayed in the changelog.
- The block header now uses a plain label (no 📄 emoji prefix).
- Retain existing relatedFiles handling so related file references continue to be appended when present.


Related: i18n.js

#### src/analyzeWithLLM.js
### Changes in analyzeWithLLM.js

- Added a requestWithRetry helper with MAX_RETRIES and backoff to make API calls more reliable.
- Introduced DEFAULT_MODEL, REQUEST_TIMEOUT_MS, and MAX_RETRIES constants to standardize defaults.
- chooseModel now accepts an apiKeyFromCLI parameter, uses that or falls back to getAPIKey, and fetches models safely; if fetching models fails or returns none, it uses DEFAULT_MODEL and informs the user; the default is wired into the prompt configuration.
- Enhanced model options listing to display bold green model names with price, and insert separators every two models; default selection is set to DEFAULT_MODEL when available.
- analyzeDiffBlock now accepts apiKeyFromCLI, uses the provided key or falls back to getAPIKey, checks for file existence before reading, and gracefully handles missing files with a placeholder diff context; binary diff handling remains; API calls for analysis are performed via requestWithRetry with a 20s timeout; successful responses now include filename and filePath.
- analyzeDeletesBlocks now accepts apiKeyFromCLI and uses the retry-enabled API call path to fetch and process delete blocks; the key is chosen from CLI or environment as before.
- summarizeCommit now accepts apiKeyFromCLI, compiles the involved file paths using filePath or filename, and augments the parsed response with the files array; prompts and language handling are preserved.
- Improved error handling and messaging around missing API keys and fetch failures, with consistent timeout handling across API calls.


Related: src/config.js, ./i18n.js, src/generateProjectTree.js, utils/fetchModels.js

#### src/codeHandler.js
### Changes in codeHandler.js

- Use a stable identifier derived from filePath (fallback to filename) to build the undirected graph for block relationships.
- Update graph construction to store edges using the derived id instead of bloque.filename.
- Ensure reverse edges also use the derived id, maintaining bidirectional relationships even when filePath is present.
- Update the traversal (BFS/DFS) and grouping logic to operate on the stable id, grouping blocks by filePath/filename consistently.

These changes make relationship grouping resilient to file renames or moves by consistently using a stable identifier.


#### src/commitFlow.js
### Changes in commitFlow.js

- Export the obtenerArchivosDesdeDiff function so it can be reused by other modules.
- Replace basename-based matching with direct full-path matching (block.filePath) when determining if a diff block belongs to a summary, improving accuracy for files with subdirectories or renamed paths.


Related: i18n.js, src/gitHandler.js, src/changelogHandler.js

#### src/generateProjectTree.js
### Changes in generateProjectTree.js

- Replaced emoji-based markers with ASCII markers: files become "- <name>", directories become "> <name>" when creating per-entry labels.
- Updated the final output format to a bullet list by prefixing each line with "* " instead of a tree-branch style.
- The method to derive directory entries from file paths remains unchanged; only the presentation layer was modified.


#### src/diffValidator.js
### Changes in diffValidator.js

- Hardened the git diff fetching: wrap the call to getGitDiff in a try/catch, log a translated error message on failure, and return null to avoid unhandled exceptions.
- Improve empty-diff handling: when there are no staged changes, log a no-staged-changes message and an instruction to use git add, then return null.
- Add verbose diff visibility: when isVerbose is true, print a full-diff header and the raw diff for easier debugging.
- Extend move-detection entry point: pass isVerbose and lang to detectMovedFunctions so it can conditionally log and localize output.
- Disable aggressive move-detection by default: replace the old detection logic with a conservative approach that reports deletions only and does not rely on brittle cross-file name matching.
- Update artificial-block generation formatting: adjust the relocation messaging and header style (from a warning-styled header to a plain header) and harmonize the wording when no relocated functions are detected.
- Adjust relocation messaging text:
  - Use a consistent arrow in relocation entries (`- \\`${func}\\` -> \\`${newFile}\\``).
  - Change the relocation detection message to: "The file `originalFile` was deleted, and the following functions were relocated:" plus the list, or a clear fallback when none are detected.
- Improve verbose rendering of artificial blocks: only print the artificial blocks table if there are any blocks, preventing empty logs.
- Remove unused legacy exports: the Dashboard and increment helper exports are eliminated as part of cleanup.
- Keep helper stubs for removed/added function extraction: extractRemovedFunctions and extractAddedFunctions remain, but they are no longer used by the move-detection flow.

Related: src/gitHandler.js, src/codeHandler.js, i18n.js

#### src/config.js
### Changes in config.js

- Moved configuration storage to a centralized path: ~/.config/smart-commit-ia/config.json.
- getAPIKey now reads OPENROUTER_API_KEY from the environment and returns it when set, bypassing prompts.
- Enhanced CLI language parsing:
  - Recognizes --es and --en flags and returns corresponding language codes.
  - Recognizes --lang <value> to specify language, validating against [es, en].
- getLanguage respects CLI args by updating and persisting config.lang, or prompts for language when not set.

Related: i18n.js

#### tests/core.test.js
### Changes in core.test.js

- Added tests for splitDiffByFile to ensure file paths are preserved and deletions are correctly identified.
- Added tests for agruparPorRelaciones to verify grouping by full paths to avoid collisions between multiple directories.
- Added tests for obtenerArchivosDesdeDiff to ensure files are matched by full path against summaries.
- Added tests for detectMovedFunctions to ensure deletions are not aggressively matched and moved functions are reported correctly (empty moved list for simple case).


Related: src/codeHandler.js, src/commitFlow.js, src/diffValidator.js

#### utils/fetchModels.js
### Changes in fetchModels.js

- Add a 10-second AbortController timeout for the OpenRouter models fetch and ensure the timeout is cleared regardless of outcome.
- Introduce try/catch/finally to gracefully handle errors and return an empty list on failure.
- Normalize API response into a richer allModels array (name, price, maxTokens, cost), filtering out models without pricing and sorting by cost.
- Preserve a set of must-have models and merge them with the cheapest topN models, then deduplicate by model name before returning.
- Expose model objects without the transient cost field so the returned API surface remains stable.
- Update price formatting: formatPrice now shows input and output using a plus separator (e.g., $X / 1M input + $Y / 1M output), while parsePrice still represents the total cost as the sum of input and output.


#### src/gitHandler.js
### Changes in gitHandler.js

- Improve error handling across git-related operations by appending the original error message to user-facing errors for getGitDiff, stageAllChanges, unstageAllChanges, getGitStatus, and commitWithMessage.
- Introduce localization-aware feedback for staging operations: log actions using i18n keys (addingFiles, removingFiles) and surface staging errors with a localized key (stagingError).
- Refine commit error handling to use a localized error key (gitCommitError) when available and provide a clearer final message (No se pudo ejecutar git commit: <err.message>).
- Enhance stageSpecificFiles logic to determine which files to add vs remove based on existence checks and report the results via i18n-enabled logs, preserving the behavior of adding existing files and removing non-existent ones.
- getGitStatus now propagates the original error message alongside the generic failure message for easier debugging when git status retrieval fails.

These changes rely on the local i18n helper (t) from i18n.js to provide localized user-facing strings.

Related: i18n.js

---
