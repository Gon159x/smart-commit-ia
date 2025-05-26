
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

## [dev] - 2025-05-23

### Commit: cbc809b

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `anotherFile.js` (no functions relocated)

---

---

## [dev] - 2025-05-23

### Commit: 533a6b1

#### 📄 analyzeWithLLM.js
### Changes in analyzeWithLLM.js
- Added 'User-Agent' header (`smart-commit-ia/1.0`) to all axios POST requests to the OpenRouter API for better request identification and tracking.

Related: config.js, generateProjectTree.js, fetchModels.js

---

---

## [dev] - 2025-05-26

### Commit: 21e8b3b

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `anotherFile.js` (no functions relocated)

---

---

## [dev] - 2025-05-26

### Commit: bc1cdef

#### 📄 cliSetup.js
### Changes in cliSetup.js
- Imported `getLanguage` from `./config.js` to retrieve language preference.
- Obtained and logged the language setting in the CLI setup process.
- Modified the return statement to include the `lang` variable for use in subsequent processes.
- Added prompts to confirm user actions and integrate internationalization support.
- Overall enhancement to include language configuration and improve user interaction visibility.

Related: config.js, gitHandler.js

#### 📄 config.js
### Changes in config.js
- Renamed the configuration path variable for clarity.
- Refactored configuration loading and saving into `loadConfig` and `saveConfig` functions.
- Modified `getAPIKey` to load existing config before prompting and saving the API key.
- Added `getLanguage` function to manage language preference, prompt user if not set, and save preference.
- Included console message confirming language setup.
- Improved code organization by separating concerns and reusing functions.

Related: fs, path, os, inquirer

---

---

## [dev] - 2025-05-26

### Commit: 566a649

#### 📄 deleted_files_summary
### Deleted files summary
- Removed `anotherFile.js` (no functions relocated)

---

---

## [dev] - 2025-05-26

### Commit: dec773e

#### 📄 index.js
### Changes in index.js
- Updated the `summarizeCommits` function to accept a `lang` parameter for language-specific summaries.
- Replaced hardcoded language codes with dynamic `lang` parameter in `summarizeCommits` calls.
- Integrated internationalization (`i18n`) support by importing and utilizing the `t` function for translating interface text.
- Modified CLI setup to capture and pass the user's language preference (`lang`) throughout the commit summarization process.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js, i18n.js

#### 📄 cliSetup.js
### Changes in cliSetup.js
- Imported `t` function from `i18n.js` for localization support.
- Replaced static prompt messages and console logs with internationalized strings from `t()`.
- Added localization to API key display and language info output.
- Updated spinner success message to be localized.
- Ensured all user-facing strings are now sourced from the i18n module for multi-language support.
- Maintained existing functionality while enhancing multilingual capabilities.

Related: config.js, gitHandler.js, i18n.js

#### 📄 config.js
### Changes in config.js
- Added a new function `getLangFromArgs` to parse command-line arguments for language options.
- Enhanced `getLanguage` to prioritize CLI arguments (`--es`, `--en`, `--lang`) for setting the language, overriding stored config.
- Included logic to handle `--lang` with a specified value (`es` or `en`) from command-line arguments.
- Slight formatting improvements for clarity and consistency in the code.

Related: config.js, inquirer.js

#### 📄 i18n.js
### Changes in i18n.js

- Introduced a new internationalization module that loads locale data from `locales/en.js` and `locales/es.js`.
- Defined a `t` function to retrieve translation strings based on a key and optional language parameter, defaulting to English.
- Included fallback to return the key itself if translation or language is not found, ensuring graceful degradation.

Related: en.js, es.js

#### 📄 en.js
### Changes in en.js
- Introduced a new localization file with English strings for API key usage, language label, Git-related prompts, and file list.
- The file exports default object containing key-value pairs for UI messages.
- These strings facilitate internationalization support for the application.
- The content matches the imported module structure used elsewhere in the project.

Related: en.js

#### 📄 es.js
### Changes in es.js

- Introduced a new Spanish language localization file with translations for API usage prompts, language selection, git commands, and commit suggestions.
- Defined key-value pairs for user interface strings to support Spanish-speaking users.

This update enhances the application's internationalization by providing Spanish support.

Related: es.js

---
