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
