
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
