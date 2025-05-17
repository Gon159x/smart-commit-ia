
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
