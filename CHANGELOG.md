---

## [dev] - 2025-05-17

### Commit: e12e2f9

#### 📄 index.js
### Changes in index.js
- Refactored the script to modularize initialization, diff validation, analysis, and commit actions.
- Separated the commit summarization into the new function `summarizeCommits`, which groups and presents commit suggestions.
- Improved flow control by integrating the new `summarizeCommits` for clearer commit handling.
- Moved core orchestration to the `main` function with clearer logic and better separation of concerns.
- Commented out redundant or debugging code for summaries.
- Ensured all functions and processes align with the new modular design for clarity and maintainability.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js

#### 📄 analyzeFlow.js
### Changes in analyzeFlow.js
- Introduces `analyzeBlocksWithIA` function that processes multiple code blocks concurrently, providing real-time feedback using a spinner, and compiles their analysis results.
- Adds `printGitAdviceIfNeeded` function that suggests best practices for commit granularity when multiple blocks are analyzed, encouraging responsible and meaningful commits.
- Implements verbose logging to display detailed responses from the analysis function for debugging or deeper insights.
- Utilizes external modules `ora` for command-line spinners and `chalk` for colored terminal text to enhance user interaction.
- Imports `analyzeDiffBlock` from `./analyzeWithLLM.js` for content analysis based on language models.

Related: analyzeWithLLM.js

#### 📄 analyzeWithLLM.js
### Changes in analyzeWithLLM.js
- Removed the unused import of the 'os' module to clean up the code.
- The core functionality for analyzing diff blocks and summarizing commits remains unchanged.
- Maintains the existing interaction with the project files and the API for language model processing.

This cleanup helps improve code clarity and reduces unnecessary dependencies.

Related: config.js, generateProjectTree.js, codeHandler.js

#### 📄 changelogHandler.js
### Changes in changelogHandler.js
- Introduced a new module for appending formatted changelog entries to the 'CHANGELOG.md' file.
- The `appendToChangelog` function gathers the current Git branch, commit hash, and date to include in the changelog.
- Formats each block of changes with filename, content, and related files if available, then appends or creates the changelog file.
- Adds a success message in green indicating the changelog has been updated.

Related: changelogHandler.js

#### 📄 cliSetup.js
### Changes in cliSetup.js
- Added a new module that sets up CLI interactions using inquirer for user prompts.
- Incorporates ora to display a loading spinner when staging all changes with git.
- Uses chalk to output styled text, including displaying the API key's partial info.
- Retrieves API key via getAPIKey() function and logs it in a formatted manner.
- Prompts user for confirmation whether to add recent changes to git commit, and executes staging if confirmed.
- Exports setupCLI function to facilitate CLI setup process in project initialization.

Related: config.js, gitHandler.js

#### 📄 codeHandler.js
### Changes in codeHandler.js
- Modified the function `agruparPorRelaciones` to build an undirected graph (bidirectional relationships) between files based on `relatedFiles`, enabling more accurate grouping of related code blocks.
- Updated the grouping logic to use BFS/DFS traversal with a `Set` of visited nodes, improving the detection of connected components.
- Added a condition to exclude the file `CHANGELOG.md` from the diff filtering process, alongside other common directories and lock files.
- The grouping mechanism now correctly identifies and clusters files that are mutually related, even in complex network structures.
- Improved maintainability and clarity of the relationship mapping logic by switching to a graph-based approach.

Related: fs, @babel/parser, @babel/traverse

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Introduced `promptCommitAction` for user interaction to select how to handle commit summaries.
- Implemented `performCommitActions` to process user choices: create single or multiple commits, copy messages, or cancel.
- Added functionality to automatically append to the changelog and commit the changelog if changed, through `commitChangelogIfChanged`.
- Utilized `clipboardy` for copying commit messages to clipboard.
- Integrated git handling functions for staging, unstaging, and committing files, with error handling.
- Implemented multi-commit workflow, batching individual files and messages.
- Updated changelog commit logic to only commit if the changelog file was modified.


Related: gitHandler.js, changelogHandler.js

#### 📄 diffValidator.js
### Changes in diffValidator.js
- Introduced a new module that retrieves the current Git diff and validates if there are staged changes.
- Added a function `getAndValidateDiff` that fetches the diff using `getGitDiff`, checks for empty diffs, and provides verbose output if specified.
- Implemented diff splitting by file using `splitDiffByFile` to organize diffs per modified file.
- Included user-friendly console output indicating the number of modified files and their names.
- Incorporated color-coded messages for better terminal readability.

Related: gitHandler.js, codeHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js

- Introduced the `getGitStatus` function to fetch the current git repository status.
- The new function uses `git.status()` from 'simple-git' and handles errors by throwing a descriptive message.
- This complements existing git operations such as diff, add, reset, and commit, providing a comprehensive git management interface.

### Summary of full file updates

- Exported a new asynchronous function `getGitStatus` that retrieves the current repository status.
- Maintains consistent error handling with other functions in the module.
- Enhances the module's capabilities to include status checks for more robust git operations.

Related: gitHandler.js

---

---

## [dev] - 2025-05-17

### Commit: a565385

#### 📄 dashboard.jsx

# Changes in dashboard.jsx

- Changed initial state of `key` in `CounterWrapper` from `0` to `39`.
- Updated the `setKey` callback in `CounterWrapper` to increment by `55` instead of `1`, to trigger a reset of the `Counter` component with a different key value.
- This logic ensures that clicking the "Resetear desde Dashboard" button properly remounts the `Counter` component.

These modifications improve the control over the Counter component's reset behavior.

Related: testing.jsx

#### 📄 testing.jsx

### Changes in testing.jsx

- Changed the CSS class name of the root `<div>` in the `Counter` component from `counter-container` to `counter-dwdw` for styling adjustments.

---

---

## [dev] - 2025-05-17

### Commit: 3c579f2

#### 📄 devToolsHelper.js

### Changes in devToolsHelper.js

- Introduced a new function `waitForUserInput` that prompts the user with a message and waits for ENTER keypress in the terminal.
- Utilizes Node.js `readline` module to handle input/output stream interactions.
- Provides a Promise-based API for asynchronous control flow during CLI operations.

Related: readline

---

---

## [dev] - 2025-05-17

### Commit: 39b59de

#### 📄 index.js
### Changes in index.js
- Inserted three new line characters (`\n\n\n`) to improve readability before outputting the commit summaries.
- The rest of the script remains unchanged, maintaining existing functionalities such as setting up CLI, analyzing diffs, grouping commits, and handling user actions.
- The modification enhances the console output formatting for better visual separation of the summaries section.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js

#### 📄 analyzeWithLLM.js
### Changes in analyzeWithLLM.js
- Added a `buildChoices` function to improve model selection display with styled options and separators.
- Updated `chooseModel` to fetch models dynamically from OpenRouter and present styled choices.
- Integrated fetching of models within the `chooseModel` function.
- Modified `analyzeDiffBlock` to read the full file content for comprehensive analysis.
- Included detailed system instructions for JSON response formatting in `analyzeDiffBlock`.
- Enhanced prompt content with full project context and file content in `analyzeDiffBlock`.
- Retained summarization functions with updated prompts for Spanish or English output.

Related: config.js, generateProjectTree.js, fetchModels.js

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Added a console.log statement to output whether there were changes in the changelog during the commit actions, displaying a message in red.
- Ensures visibility of changelog update status during the commit process.
- No other functionality changes introduced.

Related: gitHandler.js, changelogHandler.js

#### 📄 fetchModels.js
### Changes in fetchModels.js
- Introduced a new function `fetchModelsFromOpenRouter` that retrieves models from the OpenRouter API, filters and sorts them by cost, and returns a simplified list.
- The function applies filtering to include only models with prompt pricing and ensures inclusion of certain popular models.
- Implements helper functions `formatPrice` and `parsePrice` to handle model pricing formatting and parsing, considering input and output token costs.
- Defines a list of always-included models, ensuring they appear in the final list, with additional models limited by `topN` parameter.
- The returned models are unique by name and exclude price formatting details.

Related: fetchModels

---

---

## [dev] - 2025-05-17

### Commit: dac518d

#### 📄 index.js
### Changes in index.js
- Added extra newlines (`console.log("\n\n\n")`) after displaying commit summaries to improve output readability.
- The spacer helps visually separate the summaries from subsequent prompts or logs.
- No changes to core logic or functionality, purely for formatting enhancement.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js

#### 📄 analyzeWithLLM.js
### Changes in analyzeWithLLM.js
- Added `fetchModelsFromOpenRouter` import to retrieve available models dynamically.
- Implemented `buildChoices` function to create styled choices for model selection, grouping options with separators.
- Enhanced `chooseModel` to fetch models from OpenRouter API using the user's API key and display styled choices.
- Improved `analyzeDiffBlock` to include full file content read from disk, facilitating comprehensive analysis.
- Updated `analyzeDiffBlock` to generate a JSON report with a detailed markdown summary, filename, and related files referenced in imports.
- Modified `summarizeCommit` to generate summaries in specified language, with better handling of response parsing.
- Overall, the code now supports dynamic model selection and provides richer analysis features.

Related: config.js, generateProjectTree.js, fetchModels.js

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Added missing `return` statements at the end of the `performCommitActions` function for each conditional block (`single`, `unified`, `multi`) to ensure the function exits properly after executing a branch.
- This prevents unintended fall-through and potential execution of code beyond the conditional blocks.
- Maintains the function's control flow, ensuring predictable behavior after each action.
- No other functional changes were introduced.

Related: gitHandler.js, changelogHandler.js

#### 📄 fetchModels.js
### Changes in fetchModels.js
- Implemented `fetchModelsFromOpenRouter` function to retrieve models from OpenRouter API with authorization header.
- Processed API response to filter models with prompt pricing, and mapped them with additional info like price, maxTokens, and cost.
- Sorted models by their cost to identify the most economical options.
- Ensured the returned list of models always includes specific high-priority models (e.g., GPT-4 variants), along with the cheapest models based on the limit `topN`.
- Used `formatPrice` to generate a user-friendly string representing the model's pricing.
- Used `parsePrice` to compute a numeric cost for comparison purposes, representing total price per token.
- Created the new file `fetchModels.js` with these functionalities, useful for model selection in the application.

Related: fetchModels

---

---

## [dev] - 2025-05-21

### Commit: dd24658

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `dashboard.jsx`, moved `Dashboard` to `src/diffValidator.js`
- Removed `src/getGitDiff.js` (no functions relocated)
- Removed `testing.jsx`, moved `increment` to `src/diffValidator.js`
- Removed `testing2.txt` (no functions relocated)

Related: diffValidator.js

#### 📄 index.js
### Changes in index.js
- Updated the `main` function to destructure `removedBlocks` from the result of `getAndValidateDiff`.
- Passed `removedBlocks` as an additional argument to `analyzeBlocksWithIA` to incorporate removed blocks analysis.
- Added a newline before the comments at the end of the main function for better readability.
- No other functional behavior changes; improves the flow by considering removed code blocks in the analysis process.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js

#### 📄 analyzeFlow.js
### Changes in analyzeFlow.js
- Imported `analyzeDeletesBlocks` function to handle analysis of deleted or refactored files.
- Updated `analyzeBlocksWithIA` to process `removedBlocks` by calling `analyzeDeletesBlocks` if such blocks are provided.
- Added a verbose summary output for deleted/refactored files analysis results.
- Enhanced the main loop to process individual code blocks with `analyzeDiffBlock` as before.
- Ensured `parsedBlocks` include results from both diff analysis and delete analysis, with appropriate filenames and related files.
- Slightly improved console messaging to indicate successful processing and errors.

Related: analyzeWithLLM.js

#### 📄 analyzeWithLLM.js
### Changes in analyzeWithLLM.js
- Added `analyzeDeletesBlocks` to process deleted files and identify relocated functions, returning a JSON summary.
- Enhanced `analyzeDiffBlock` to analyze code diffs, full file content, and generate structured JSON reports.
- Implemented `summarizeCommit` to create commit messages based on grouped change summaries and project structure.
- Introduced a helper `buildChoices` for model selection with styled options.
- Included logic to fetch available models from OpenRouter before prompting.
- Updated import statements for necessary modules.

These additions enable improved automation in code review and changelog generation workflows.

Related: config.js, generateProjectTree.js, fetchModels.js

#### 📄 codeHandler.js
### Changes in codeHandler.js
- Improved `splitDiffByFile` to detect explicit file renames using 'rename to' lines and set flags for deleted and new files.
- Added filtering logic to exclude certain files and directories such as node_modules, git directories, build artifacts, and lock files.
- Retained existing functions for splitting diffs into chunks and extracting function names, as well as analyzing source code with Babel.
- These changes facilitate better handling of diff data, especially in rename scenarios, and improve file management during diff processing.

Related: babelTraverse.js

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Removed premature return statements in performCommitActions to ensure the function execution completes properly.
- The early returns were preventing subsequent changes, such as changelog commits, from executing.
- Maintained the flow for handling different commit strategies (`single`, `unified`, `multi`, and `copy`) and the final changelog commit step.
- Ensured that the function always reaches the end, allowing any post-processing or final steps to run.

Related: gitHandler.js, changelogHandler.js

#### 📄 diffValidator.js
### Changes in diffValidator.js
- Introduced functions `detectMovedFunctions`, `extractRemovedFunctions`, and `extractAddedFunctions` to identify moved functions between files based on diff blocks.
- Updated `getAndValidateDiff` to incorporate move detection logic, generate artificial blocks for deleted files with relocated functions, and enhance verbose logs.
- Provided mechanisms to distinguish between deleted files and files that are part of refactors or relocations, creating artificial blocks accordingly.
- Added verbose logging to display move summaries, artificial blocks, and artifact management actions during diff processing.
- The main validation function now returns an object containing original and artificial blocks, enabling better tracking of file moves and deletions.

Related: gitHandler.js, codeHandler.js

#### 📄 fetchModels.js
### Changes in fetchModels.js
- Introduced a new utility function fetchModelsFromOpenRouter to fetch and process model data from OpenRouter API.
- The function filters models with prompt pricing, sorts them by cost, and ensures inclusion of specific 'must-have' models.
- Incorporated helper functions formatPrice and parsePrice to format and parse pricing data respectively, focusing on token costs.
- The new function returns a unique list of models optimized by cost and essential model inclusion.

Related: fetchModels.js

---

---

## [dev] - 2025-05-21

### Commit: 55e6ba1

#### 📄 checks.md
### Changes in checks.md
- Created a new documentation file `checks.md` to outline pending issues and future enhancements for the project.
- Highlighted a key issue: the system does not detect file deletions, with a note to resolve it.
- Listed additional improvements such as language support, free tier improvements, user prompting features, ignore options for other languages or frameworks, deployment to NPM, and promotional activities.
- The document serves as a planning and tracking tool for upcoming development efforts.

---

---

## [dev] - 2025-05-21

### Commit: 770bcfd

#### 📄 devToolsHelper.js
### Changes in devToolsHelper.js
- Renamed and relocated the `devToolsHelper.js` file to the `utils` directory.
- Exported an asynchronous function `waitForUserInput` that prompts the user with a message and waits for ENTER press.
- Utilizes Node.js `readline` module to handle user input in the terminal.

Related: readline

---

---

## [dev] - 2025-05-21

### Commit: ead75e9

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `dashboard.jsx` (no functions relocated)
- Removed `src/devToolsHelper.js` (no functions relocated)
- Removed `src/getGitDiff.js` (no functions relocated)
- Removed `testing.jsx` (no functions relocated)
- Removed `testing2.txt` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: eff3bfa

#### 📄 analyzeWithLLM.js
### Changes in analyzeWithLLM.js
- Introduced `analyzeDeletesBlocks` to analyze deleted files and moved functions using GPT model, returning a structured JSON summary.
- Enhanced `summarizeCommit` to produce a concise, language-specific commit message based on grouped file changes and project structure.
- Added `buildChoices` helper for styled model selection prompts, improving UX.
- Updated import statements with `fetchModelsFromOpenRouter`.
- Included detailed prompts guiding GPT for analyzing deletions and creating commit summaries.
- Implemented robust error handling for JSON parsing and API request failures.

This update improves the script's capacity to automatically analyze code deletions, track function relocations, and generate meaningful commit messages.

Related: config.js, generateProjectTree.js, fetchModels.js

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `dashboard.jsx` (no functions relocated)
- Removed `src/devToolsHelper.js` (no functions relocated)
- Removed `src/getGitDiff.js` (no functions relocated)
- Removed `testing.jsx` (no functions relocated)
- Removed `testing2.txt` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 .gitignore
### Changes in .gitignore,- Added entries to ignore package lock files for npm, yarn, and pnpm: `package-lock.json`, `yarn.lock`, and `pnpm-lock.yaml`,- Ensures that all major package managers' lock files are excluded from version control to maintain a clean repository

Related: config.json

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 gitHandler.js
### Changes in gitHandler.js

- Replaced the asynchronous `stageSpecificFiles` function with a synchronous implementation that handles existing files and deletions explicitly.
- Added try-catch blocks within the iteration to warn about files that could not be staged or removed.
- Maintained the overall logic for adding or removing files, now with improved error handling and feedback.
- Preserved existing functions for staging, unstaging, committing, and getting git status, ensuring compatibility with new function updates.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `dashboard.jsx` (no functions relocated)
- Removed `src/devToolsHelper.js` (no functions relocated)
- Removed `src/getGitDiff.js` (no functions relocated)
- Removed `testing.jsx` (no functions relocated)
- Removed `testing2.txt` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 .gitignore
### Changes in .gitignore
- Added entries for various package manager lock files: `package-lock.json`, `yarn.lock`, and `pnpm-lock.yaml`.
- Ensures that lock files generated by npm, yarn, and pnpm are excluded from version control.
- Maintains a clean repository by ignoring environment and cache files.

This update improves project configuration by preventing lock files from being committed to version control, allowing each environment to manage dependencies independently.

Related: .gitignore

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Added a console.log statement inside the loop of the `performCommitActions` function to output the `blocks` array for debugging purposes.
- The log helps trace the data passed to the function during each iteration when processing summaries.
- No other functional changes were introduced in this update.

Related: gitHandler.js, changelogHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js
- Replaced the async `stageSpecificFiles` function with a synchronous version to handle individual file operations more reliably.
- For each file, the function now checks if it exists and performs a `git add` or `git rm --cached` accordingly, capturing potential errors.
- Added warning logs for files that cannot be added or removed, allowing the process to continue without throwing exceptions.
- Maintained existing functions for staging all changes, unstaging all, committing, and retrieving status, preserving existing behaviors.
- Changed from using `git.add(files)` to custom per-file handling to improve error management and support for deleted files.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `dashboard.jsx` (no functions relocated)
- Removed `src/devToolsHelper.js` (no functions relocated)
- Removed `src/getGitDiff.js` (no functions relocated)
- Removed `testing.jsx` (no functions relocated)
- Removed `testing2.txt` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 .gitignore
### Changes in .gitignore
- Added entries to ignore package-lock.json, yarn.lock, and pnpm-lock.yaml files to prevent them from being committed to version control.
- Ensured build and environment lock files are properly ignored to avoid conflicting dependency states.

Related: config.json, node_modules, .config

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Added console.log statements to log the `blocks` and `resumen` objects during each iteration over summaries in the `performCommitActions` function, aiding in debugging the selected blocks and their corresponding summaries.
- These logs help trace the data flow and verify that the correct file paths are being processed for each commit.
- No functional logic has been altered; this change is solely for debugging purposes.

Related: gitHandler.js, changelogHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js
- Replaced the asynchronous `stageSpecificFiles` function with a synchronous version that explicitly handles existing or deleted files using `fs.existsSync` and `git rm --cached`. This allows for more granular control and more robust handling of file states.
- Maintained the original error handling with warnings for individual files instead of rejecting the entire operation.
- Added new comments to clarify the logic for different file states.
- Updated function implementation to support adding or removing files based on their existence, improving robustness in various scenarios such as file deletions.
- Overall enhancement facilitates more accurate staging of files, especially in scenarios involving deletions or missing files.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `dashboard.jsx` (no functions relocated)
- Removed `src/devToolsHelper.js` (no functions relocated)
- Removed `src/getGitDiff.js` (no functions relocated)
- Removed `testing.jsx` (no functions relocated)
- Removed `testing2.txt` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 .gitignore
### Changes in .gitignore
- Added entries to ignore package lock files for various package managers, including `package-lock.json`, `yarn.lock`, and `pnpm-lock.yaml`.
- This helps prevent these lock files from being committed to the repository, maintaining a cleaner version control history.

### Full updated file content

```tsx
# dependencias
node_modules/

# configuración local
.config/
config.json

# logs y sistemas de cache
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# ambiente
.env
.env.*.local

# sistemas de lock de editores
*.lock

# archivos de lock de gestores de paquetes
package-lock.json
yarn.lock
pnpm-lock.yaml
```

Related: ..config/.json

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Added console.log statements to output the `blocks` and `resumen` objects during each iteration of the multi-commit process for debugging purposes.
- These logs help trace the contents of `blocks` and `resumen` when performing batch commits.
- No other functional changes were introduced.


Related: gitHandler.js, changelogHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js
- Switched from async git.add method to a custom implementation that handles individual file existence checks.
- Updated stageSpecificFiles to add or remove files based on their existence, handling deleted files with `git rm --cached`.
- Added try-catch to each file operation with warnings for failures.
- Imported fs-extra for file existence checks.
- Overall, enhanced robustness ensuring files are staged, including deleted ones, with better error handling.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: ae5ceb5

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `dashboard.jsx` (no functions relocated)
- Removed `src/devToolsHelper.js` (no functions relocated)
- Removed `src/getGitDiff.js` (no functions relocated)
- Removed `testing.jsx` (no functions relocated)
- Removed `testing2.txt` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: 0310d2f

#### 📄 .gitignore
### Changes in .gitignore
- Added entries for `package-lock.json`, `yarn.lock`, and `pnpm-lock.yaml` to ignore package manager lock files, aligning the ignore patterns with project management practices.

Related: .gitignore, config.json

---

---

## [dev] - 2025-05-21

### Commit: 7d77f4a

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Added console.log statements to output the contents of `blocks` and `resumen` objects during each iteration of the multi-commit process for debugging purposes.
- These logs help trace the file paths and summary content being processed in batch commits.
- No functional changes to the commit logic, purely for debugging and development insight.

Related: gitHandler.js, changelogHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js
- Refactored `stageSpecificFiles` to handle files that may be deleted: if a file exists, it is added; if not, it is removed from the index.
- Replaced the asynchronous git add command with synchronous `execSync` for better control and compatibility with file existence checks.
- Added error handling and warnings for cases where files cannot be staged or un-staged.
- Preserved existing functions for complete git management including diff, commit, and status retrieval.
- Ensured consistent use of `fs-extra` and `child_process` for filesystem and command execution operations.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: 44935ae

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `dashboard.jsx` (no functions relocated)
- Removed `src/devToolsHelper.js` (no functions relocated)
- Removed `src/getGitDiff.js` (no functions relocated)
- Removed `testing.jsx` (no functions relocated)
- Removed `testing2.txt` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: d900091

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Introduced logic to filter and stage only relevant files based on summaries and blocks in 'performCommitActions'.
- Modified the 'single' action handler to stage specific files determined by comparing block file paths with summary files.
- Added debug logs to display blocks, summaries, and full paths involved in the commit.
- Ensured that only the targeted files are staged before committing, enhancing granular control over commits.

Related: gitHandler.js, changelogHandler.js, path.js

---

---

## [dev] - 2025-05-21

### Commit: 383363c

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Removed two console.log statements that logged 'Blocks----->' and 'Resumen----->' within the 'performCommitActions' function when the action is 'single'. These logs were likely for debugging purposes and are now excluded to keep the output clean.
- The rest of the function implementation remains unchanged, ensuring original behavior is preserved.
- Maintains the enhancement of conditional commit behaviors and changelog updates based on user actions.
- Overall, this change improves code cleanliness and suppresses debug logs from appearing during regular execution.

Related: gitHandler.js, changelogHandler.js

---

---

## [dev] - 2025-05-21

### Commit: 60dcbaf

#### 📄 index.js
### Changes in index.js

- Added null check for the result of getAndValidateDiff to prevent runtime errors if the function returns null or undefined.
- Ensured that the script exits early when no diff data is returned, maintaining stability.
- Retained existing code to process blocks and removedBlocks only when valid data is available.

This improves robustness by handling cases where no diff data is fetched.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js

---

---

## [dev] - 2025-05-21

### Commit: 1ed955f

#### 📄 probando.js
### Changes in probando.js
- Introduced a new function `aSimpleFunction` that returns the value 32.

---

---

## [dev] - 2025-05-21

### Commit: b178c56

#### 📄 devToolsHelper.js
### Changes in devToolsHelper.js
- Renamed and relocated the `devToolsHelper.js` file from `utils/` to `src/`
- Provided a utility function `waitForUserInput` that prompts the user with a message and waits for ENTER key press
- The function utilizes Node.js `readline` module to manage input/output interface
- Simplifies waiting for user input for scripts or CLI tools using a customizable message

Related: readline

---

---

## [dev] - 2025-05-21

### Commit: e8bbadc

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `utils/devToolsHelper.js` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: e7446ab

#### 📄 probando.js
### Changes in probando.js
- Introduced a new function `aSimpleFunction` that returns the value 32.

---

---

## [dev] - 2025-05-21

### Commit: c69db42

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Added a console.log statement to output `fullPaths` array for debugging purposes before staging and committing files.
- The log helps trace which files are being included in the commit operation, improving the debugging process.
- No other functional changes or logic modifications are included in this update.

Related: gitHandler.js, changelogHandler.js

---

---

## [dev] - 2025-05-21

### Commit: f3592c5

#### 📄 devToolsHelper.js
### Changes in devToolsHelper.js
- Renamed and relocated the file from utils/devToolsHelper.js to src/devToolsHelper.js for improved project organization.
- The file provides an asynchronous function `waitForUserInput` that prompts the user with a message and waits for the ENTER key press, utilizing Node's readline interface.
- The function defaults to prompting with 'Presioná ENTER para continuar...' and resolves once the user presses ENTER.

Related: readline

---

---

## [dev] - 2025-05-21

### Commit: 47a0b22

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `utils/devToolsHelper.js` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: 61c0032

#### 📄 commitFlow.js
### Changes in commitFlow.js

- Inserted a console.log statement to output the 'blocks' array for debugging purposes during the single commit process.
- This change helps to trace the contents of 'blocks' before staging files.
- No other functional changes were made to the core commit handling logic.

Related: gitHandler.js, changelogHandler.js

---

---

## [dev] - 2025-05-21

### Commit: 8df6d1e

#### 📄 probando.js
### Changes in probando.js

- Introduced a new function `aSimpleFunction` that returns the value 32, serving as a utility or placeholder.
- Added initial content to the file, establishing basic functionality.

This new function can be used elsewhere in the project to provide a fixed numeric value or as a starting point for further development.

---

---

## [dev] - 2025-05-21

### Commit: 9e00643

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Added console.log statements to output the `blocks` array and `fullPaths` during commit actions for debugging purposes.

Related: gitHandler.js, changelogHandler.js, promptCommitAction.js

---

---

## [dev] - 2025-05-21

### Commit: df0ada6

#### 📄 devToolsHelper.js
### Changes in devToolsHelper.js
- Renamed the file from utils/devToolsHelper.js to src/devToolsHelper.js to reflect project structure reorganization.
- No changes to the actual code functionality; only the location has been updated.
- The file exports a function `waitForUserInput` that prompts the user with a message and waits for ENTER input.
- Utilizes Node.js `readline` to handle user input asynchronously.

Related: readline

---

---

## [dev] - 2025-05-21

### Commit: 8572fb9

#### 📄 probando.js
### Changes in probando.js
- Introduced a new function `aSimpleFunction` that returns the number 32.
- The function is straightforward and can be used as a utility or placeholder in future development.

---

---

## [dev] - 2025-05-21

### Commit: 98b2554

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Added console logs to output the 'blocks' array and the 'fullPaths' computed during single and multiple commit actions for better debugging.
- These logs help track the internal state and data flow during the commit process.
- No functional behavior changes were introduced; the modifications are solely for debugging purposes.

Related: gitHandler.js, changelogHandler.js

---

---

## [dev] - 2025-05-21

### Commit: 7f9f55d

#### 📄 devToolsHelper.js
### Changes in devToolsHelper.js
- Renamed and moved the file from utils/devToolsHelper.js to src/devToolsHelper.js to better organize project structure.
- No changes in the functional code; only file relocation.
- The helper function waitForUserInput facilitates waiting for user input in command-line interfaces.
- Imported readline from 'readline' to enable reading input from the console.

Related: readline

---

---

## [dev] - 2025-05-21

### Commit: 0ff2824

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `utils/devToolsHelper.js` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: 479efc0

#### 📄 devToolsHelper.js
### Changes in devToolsHelper.js
- Renamed and relocated the file from utils/ to src/ directory.
- Updated import paths accordingly to reflect new file location.
- Provided a utility function `waitForUserInput` that prompts the user with a message and waits for ENTER key press.
- Utilizes Node.js readline module to handle user input asynchronously.

Related: readline

---

---

## [dev] - 2025-05-21

### Commit: 37cc6dc

#### 📄 gitHandler.js
### Changes in gitHandler.js
- Replaced manual file existence checks and shell commands with simple-git's `add` method for staging specific files.
- Removed dependencies on `fs-extra` and `child_process`, streamlining the code.
- Ensured error handling by catching exceptions from `git.add` and throwing descriptive errors.
- Preserved existing functions for diff, staging all changes, unstaging, committing, and getting status, with improved error handling where applicable.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: a01fa89

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Se añade lógica para detectar y manejar renombramientos de archivos en el proceso de staging, mediante la detección de patrones 'rename from' y 'rename to' en los bloques.
- Se reemplaza la lógica simple de selección de archivos con una versión que evita duplicados usando un conjunto y que además incluye archivos renombrados, mejorando la precisión al preparar los archivos para commit.
- Se añaden registros de consola para depuración, mostrando los bloques y las rutas completas seleccionadas para cada commit.
- Se mantiene la estructura de manejo de múltiples y single commits con lógica ajustada para incluir renombramientos.

Related: gitHandler.js, changelogHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js
- Removed unused imports of 'fs-extra' and 'child_process' to clean up dependencies.
- Converted 'stageSpecificFiles' function to use 'simple-git' for adding files, replacing manual command execution.
- Implemented error handling with try-catch blocks in 'stageSpecificFiles' to throw meaningful errors.
- Simplified the function by removing manual existence checks, trusting 'git.add' to handle file states.
- Updated the comments for clarity and consistency in the new implementation.
- Ensured all functions follow asynchronous patterns for better integration with async workflows.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: 60f776c

#### 📄 index.js
### Changes in index.js
- Modified the `main` function to check if the result from `getAndValidateDiff` is falsy (`null` or `undefined`) and returned early to avoid destructuring errors.
- Ensured that the code only proceeds with `blocks` and `removedBlocks` when a valid result is obtained.
- Added comments to indicate continuation of processing after validation.
- No other functional changes were made.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Enhanced the `performCommitActions` function to detect and include renamed files in commit stages by parsing 'rename from' and 'rename to' lines in diff blocks.
- Replaced the previous filtering logic with a set-based approach to include all relevant files and renamed files without duplicates.
- Added console logs for debugging the blocks and file paths being staged.
- Updated the multi-commit process to robustly handle file renames during commit preparation, ensuring all relevant files are staged.

Related: gitHandler.js, changelogHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js
- Removed unnecessary imports of 'fs-extra' and 'child_process' as simple-git handles file staging.
- Reduced 'stageSpecificFiles' to utilize 'git.add' for batch staging, replacing manual file existence checks and execSync commands.
- Added logging in 'stageSpecificFiles' for debugging purposes.
- Maintained consistency in error handling across all functions.
- The functions now directly leverage simple-git methods for cleaner and more reliable Git operations.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: cd377b0

#### 📄 index.js
### Changes in index.js
- Modified the main function to check if the result from getAndValidateDiff is null or undefined before destructuring.
- Added an early return if getAndValidateDiff returns a falsy value, preventing further execution.
- Ensured the code proceeds only when valid blocks and removedBlocks are available for further processing.
- Maintained existing processing flow for commit summarization and user interactions.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Improved the logic for selecting files to stage by aggregating files based on summaries and detailed diff analysis.
- Added detection for renamed files within diffs using 'rename from' and 'rename to' patterns.
- Included handling for deleted files by detecting 'deleted file mode' and extracting the file path.
- Utilized a Set to avoid duplicate file paths in the list of files to stage for commit.
- Added detailed debug logs for blocks and full file paths during the multi-commit process, aiding troubleshooting and verification.

Related: gitHandler.js, changelogHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js
- Removed unnecessary imports of 'fs-extra' and 'child_process', simplifying dependencies.
- Updated 'stageSpecificFiles' function to utilize 'git.add(files)' for more efficient staging of multiple files.
- Added console log in 'stageSpecificFiles' for debugging purposes.
- Enhanced error handling in 'stageSpecificFiles' with descriptive error messages.
- Maintained existing functions for git diff, stage all, unstage all, commit, and status, with consistent error handling.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: fe95d0e

#### 📄 index.js
### Changes in index.js
- Modified the `main` function to check if the result of `getAndValidateDiff` is null or undefined, and exit early if so. This prevents errors when no diff information is available.
- Added a nullity check and return statement after obtaining `result` from `getAndValidateDiff`.
- Ensured the function only proceeds with `blocks` and `removedBlocks` if `result` is valid.
- Clarified the flow to handle cases where the diff validation yields no data, improving robustness.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Enhanced the logic for detecting files to stage and commit during the 'multi' action, including handling renames, deletions, and files associated with summaries.
- Replaced previous file filtering method with a set-based approach to aggregate all relevant file paths, avoiding duplicates.
- Improved logging to display the entire set of full paths being staged and committed.
- Maintained existing single and unified commit behaviors, adding robustness by better recognizing different file change types.
- Added diagnostic logs to aid in debugging the selected and detected files for commits.

Related: gitHandler.js, changelogHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js

- Replaced the synchronous implementation of `stageSpecificFiles` with an asynchronous approach using `git.add(files)` for better performance and readability.
- Removed unused imports (`fs-extra` and `child_process`) to clean up the code.
- Improved error messages in `commitWithMessage` to specify failure in `git add` operations.
- Added a new function `getGitStatus` to provide the current git repository status.
- Maintained consistent use of async/await syntax across all git operations for consistency.
- Enhanced logging and error handling to facilitate debugging and robustness.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: 2584a95

#### 📄 index.js
### Changes in index.js
- Added a null check after calling getAndValidateDiff to safely exit if the result is undefined or null.
- Ensured that the execution of blocks and removedBlocks processing only occurs with valid data.
- Cleaned up code to prevent potential runtime errors when getAndValidateDiff returns a falsy value.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Updated the `performCommitActions` function to handle file renames and deletions when performing commits.
- Added logic to detect 'rename from' and 'rename to' lines in diff blocks to include the new file paths in staging.
- Included handling for deleted files by parsing 'deleted file mode' lines and their associated paths.
- Modified how `fullPaths` are constructed to incorporate these additional file operations, ensuring accurate staging.
- Maintained existing commit and changelog update logic, integrating the enhanced file change detection.
- Added debug logs for block and fullPaths arrays to assist in troubleshooting.

Related: gitHandler.js, changelogHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js
- Removed unnecessary imports of `fs-extra` and `child_process`, cleaning up dependencies.
- Replaced manual file existence and removal logic in `stageSpecificFiles` with a direct call to `git.add(files)`, simplifying the code.
- Enhanced error handling by logging errors and throwing new errors with descriptive messages in all async git functions.
- Added `getGitStatus` function to fetch git repository status, providing more functionality.
- Improved code consistency by updating error messages across functions.
- Removed redundant code segments; the new implementation leverages `simple-git` methods directly.

### Changes in full file
- Adjusted imports for `simple-git`.
- Changed the `stageSpecificFiles` function to use `git.add(files)` directly.
- Added new function `getGitStatus` to retrieve repository status.
- Updated error handling across functions for better debugging.
- Removed unused imports and legacy code for cleaner maintenance.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: 7d77f4a

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `dashboard.jsx` (no functions relocated)
- Removed `src/getGitDiff.js` (no functions relocated)
- Removed `testing.jsx` (no functions relocated)
- Removed `testing2.txt` (no functions relocated)
- Removed `utils/devToolsHelper.js` (no functions relocated)

---

---

## [dev] - 2025-05-21

### Commit: 8323fdf

#### 📄 index.js
### Changes in index.js
- Added a null check after calling getAndValidateDiff to prevent further execution if no result is returned.
- This improves robustness by avoiding errors when the diff validation fails or returns nothing.
- The rest of the main process now safely proceeds only if valid blocks and removedBlocks are obtained.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Improved file staging logic in performCommitActions to detect renamed and deleted files within diffs.
- Added handling for 'rename from' and 'rename to' lines to include those files in the staging process.
- Included detection of deleted files from git diff output and added them to the staging list.
- Refactored staging process in 'multi' commit to dynamically include files affected by renames and deletions.
- Added debug logs to trace file paths involved in the commit process.

Related: gitHandler.js, changelogHandler.js

#### 📄 gitHandler.js
### Changes in gitHandler.js
- Refactored `stageSpecificFiles` to handle file existence checks asynchronously and separately add or remove files accordingly.
- Added logs for files being added or removed during staging.
- Enhanced error handling in `commitWithMessage` to provide more descriptive messages.
- Simplified conditional logic by checking arrays before invoking git commands.
- Maintained existing git operations like `getGitDiff`, `stageAllChanges`, `unstageAllChanges`, and added `getGitStatus` to retrieve current repository status.

Related: gitHandler.js

---

---

## [dev] - 2025-05-21

### Commit: 2cc64c4

#### 📄 probando.js
### Changes in probando.js
- Introduced a new file `probando.js` containing a function `aSimpleFunction` that returns the number 32.
- The function is straightforward and likely intended for testing or as a placeholder.

---

---

## [dev] - 2025-05-21

### Commit: f78a175

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `dashboard.jsx` (no functions relocated)
- Removed `probando.js`, moved `aSimpleFunction` to `src/commitFlow.js`
- Removed `src/getGitDiff.js` (no functions relocated)
- Removed `testing.jsx` (no functions relocated)
- Removed `testing2.txt` (no functions relocated)
- Removed `utils/devToolsHelper.js` (no functions relocated)

Related: commitFlow.js

#### 📄 commitFlow.js
### Changes in commitFlow.js
- Added helper function `obtenerArchivosDesdeDiff` to centralize logic for extracting related files from diffs, handling renames, deletes, and file inclusion checks.
- Replaced inline file collection logic in different commit modes (`single`, `unified`, `multi`) with calls to the new helper for better maintainability.
- Ensured consistent extraction logic across all commit modes, reducing code duplication.
- Added a placeholder `aSimpleFunction` (possibly for future use or as a stub).

Related: gitHandler.js, changelogHandler.js

---
