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
