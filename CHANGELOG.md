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
