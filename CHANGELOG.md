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

---

## [dev] - 2025-05-26

### Commit: db6e6e6

#### 📄 cliSetup.js

### Changes in cliSetup.js

- Added support for language selection via command line flags (--lang, --en, --es) and persistent config.
- Implemented configuration loading and saving for language preference.
- Improved help display to be translated and only shown when --help flag is used.
- Refactored language determination logic to prioritize flags, config, and defaults.
- Updated the CLI flow to use the resolved language for all messages and prompts, including confirmation messages.
- Enhanced code readability by consolidating language resolution and config management.

Related: config.js, gitHandler.js, i18n.js

---

---

## [dev] - 2025-05-26

### Commit: ec1fb03

#### 📄 en.js

### Changes in en.js

- Added help command descriptions and options to assist users in understanding available commands and flags.
- Included helpTitle, helpDescription, helpLang, helpVerbose, and helpHelp keys for enhanced user guidance.
- Updated the localization object for English to support user help and interface customization features.

Related: en.js

---

---

## [dev] - 2025-05-26

### Commit: 4b7748c

#### 📄 es.js

### Changes in es.js

- Added new help command options including `--lang`, `--verbose`, and `--help` for better CLI support.
- Introduced a help title and description to assist users in understanding available commands.
- Updated the locale with relevant help commands for the Spanish language interface.

These changes improve user guidance and CLI usability in Spanish.

Related: es.js

---

---

## [idiomas] - 2025-05-26

### Commit: 0a0dd95

#### 📄 index.js

### Changes in index.js

- Added a shebang line (`#!/usr/bin/env node`) at the top of the file to make it directly executable as a CLI command.
- No other logic or structural changes were made to the file.
- The file now can be run as a standalone command-line tool in Unix-like environments.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js, i18n.js

#### 📄 package.json

### Changes in package.json

- Added a 'start' script to run the CLI via Node.js.
- Updated the 'keywords' array with relevant tags for better discoverability.
- Included author information for project attribution.
- Updated 'description' to specify the CLI's purpose.
- No changes to dependencies or other core configurations.

Related: index.js, index.ts, cli.js, utils.js, config.js

---

---

## [idiomas] - 2025-05-26

### Commit: 72da0bc

#### 📄 index.js

### Changes in index.js

- Added a shebang line for CLI execution.
- Enhanced `summarizeCommits` to support language parameter for internationalization.
- Updated the main function to retrieve and pass language setting from CLI setup.
- Incorporated the internationalization (`i18n`) module to translate user-facing strings.
- Refactored the code to improve modularity and readability.
- Ensured all functions and imports are aligned with the new language parameter feature.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js, i18n.js

#### 📄 package.json

### Changes in package.json

- Added a 'start' script that runs the main CLI entry point at './bin/index.js'
- Expanded 'keywords' array with relevant tags such as 'git', 'commit', 'cli', 'openrouter', and 'llm'
- Added author information with name and email
- Updated 'description' to specify the CLI generates commit messages with AI using OpenRouter

Related: index.js

#### 📄 cliSetup.js

### Changes in cliSetup.js

- Integrated language detection via flags (--lang with value, --en, --es) and config fallback
- Loaded and updated language preference in persistent config file
- Changed help display to be translated based on selected language
- Showed API key info and language label with internationalized messages
- Confirmed git add step with localized message
- Refined flow to prioritize flags, then config, then default
- Modularized code to include language management and user prompts

Related: config.js, gitHandler.js, i18n.js

#### 📄 config.js

### Changes in config.js

- Added inquirer import for user prompts.
- Updated getLanguage() to prioritize CLI --lang arguments before configuration.
- Refactored getLangFromArgs() to cleanly handle --es, --en, and --lang options for language selection.
- Changed comments to be more descriptive and consistent.
- Maintained functions for loading and saving configuration with improved structure.
- Enhanced code readability and maintainability by organizing argument parsing logic.

Related: config.js

#### 📄 i18n.js

### Changes in i18n.js

- Introduced a simple internationalization module with support for English and Spanish.
- Imported locale data from external files and aggregated them into a `locales` object.
- Exported a translation function `t` that returns translated strings based on the specified language, defaulting to English.
- Implemented fallback to the original key if translation for a given key or language is missing.

Related: en.js, es.js

#### 📄 en.js

### Changes in en.js

- Introduced a new localization file containing English translations for various UI messages and commands related to API key usage, language settings, git operations, and help instructions.
- The file provides string constants such as `apiKeyUsage`, `languageLabel`, and help command descriptions, facilitating multilingual support.
- Ensures these messages are ready for integration into an internationalized interface.

This update supports better usability for English-speaking users by providing localized UI text.

Related: en.js

#### 📄 es.js

### Changes in es.js

- Introduced a new localization file `es.js` for Spanish translations.
- Provided Spanish translations for interface labels, commands, and help descriptions.
- Facilitates multilingual support by enabling Spanish language options within the application.

Related: es.js

---

---

## [idiomas] - 2025-05-26

### Commit: b6a8a84

#### 📄 index.js

### Changes in index.js

- Introduced shebang (`#!/usr/bin/env node`) for making the script executable in CLI environments.
- Added `lang` parameter to the `summarizeCommits` function to support multiple languages.
- Utilized the `t` function from `i18n.js` for translating interface texts and labels, such as commit suggestions and file lists, based on the specified language.
- Modified the main execution flow to extract the `lang` setting from CLI setup and pass it through relevant functions.
- Updated CLI setup to return `lang` alongside `isVerbose`.
- Simplified the code, ensuring new language support integrates seamlessly with existing functionality.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js, i18n.js

#### 📄 package.json

### Changes in package.json

- Added a 'start' script to initiate the CLI using 'node ./bin/index.js'.
- Enhanced 'keywords' array with tags: 'git', 'commit', 'ai', 'cli', 'openrouter', 'llm'.
- Included author information with name and email.
- Updated description to specify the CLI's purpose: generating commit messages with AI via OpenRouter.

Related: index.js, bin/index.js, cli.js, utils.js

#### 📄 cliSetup.js

### Changes in cliSetup.js

- Integrated language detection using command-line flags (`--lang`, `--en`, `--es`) with a priority system: flag > config > fallback.
- Loaded and saved language preference in configuration to persist user choices across sessions.
- Added support for `--help` flag to display localized help messages and exit.
- Refactored the process to show API key info and confirm git add with internationalized messages.
- Simplified the verbose flag detection and ensured clarity in dialog prompts.
- Included translation support for help and status messages via the `t` function.
- Ensured all UI updates reflect the selected language, promoting internationalization.

Related: config.js, gitHandler.js, i18n.js

#### 📄 config.js

### Changes in src/config.js

- Added support for command-line arguments '--es', '--en', and '--lang' in getLangFromArgs() to allow users to specify the language via CLI.
- Updated getLanguage() to prioritize CLI arguments, saving the preference to configuration if provided.
- Improved commenting and code clarity for language detection logic.
- Ensured configuration is saved whenever language preference is set or changed.
- Removed commented out or unnecessary code to streamline the module.

Related: config.js

#### 📄 i18n.js

### Changes in i18n.js

- Introduced a basic internationalization setup with translations for English and Spanish.
- Defined a `t` function to retrieve translated strings by key and language, defaulting to English.
- Imported language packs from local files and organized them into a `locales` object for easy access.

Related: en.js, es.js

#### 📄 en.js

### Changes in en.js

- Created a new localization file for English language support.
- Added key-value pairs for interface labels, prompts, help messages, and statuses, including API key usage, language selection, git commands, and help instructions.
- Structured the export as a default object for easy import and use in internationalization features.

Related: en.js

#### 📄 es.js

### Changes in es.js

- Introduced a new localization file for Spanish language support in the project.
- Provided Spanish translations for user interface prompts and help texts used by smart-commit-ia.
- The file includes translations for API usage, language selection, commit confirmation, git commands, and help instructions.

Related: utils.js

---

---

## [idiomas] - 2025-05-26

### Commit: f17ada7

#### 📄 index.js

### Changes in index.js

- Added Unix shebang (`#!/usr/bin/env node`) at the top to make the script directly executable.
- Imported the translation function `t` from `i18n.js` to support multilingual output.
- Updated `summarizeCommits` function to accept a `lang` parameter, enabling language-specific summaries.
- Changed console output in `summarizeCommits` to use localized strings for the 'suggested commit' label and file list.
- Updated the CLI setup to retrieve `lang` along with `isVerbose` for correct localization.
- Ensured the main function passes the `lang` parameter to `summarizeCommits`.
- Rest of the code remains focused on processing git diffs and commits with multilingual support, maintaining existing functionality.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, analyzeFlow.js, codeHandler.js, commitFlow.js, i18n.js

#### 📄 package.json

### Changes in package.json

- Added a 'start' script to run the CLI using Node.
- Expanded the 'keywords' array with relevant identifiers for better discoverability.
- Set the 'author' field with the developer's name and email.
- Added a descriptive 'description' for the package.

Related: index.js, bin/index.js

#### 📄 cliSetup.js

### Changes in cliSetup.js

- Added support for language selection via command-line flags (`--lang`, `--en`, `--es`) with priority: flag > config > default.
- Implemented configuration loading and saving to persist user's language preference.
- Refactored help command to display translated help messages based on selected language.
- Improved communication of API key and language to the user with internationalized messages.
- Maintained existing flow for API key retrieval and git staged changes confirmation, now with internationalization.
- Organized the code for better readability and maintainability concerning language handling and configuration management.

Related: config.js, gitHandler.js, i18n.js

#### 📄 config.js

### Changes in config.js

- Added support for specifying language via command-line arguments `--es`, `--en`, or `--lang`.
- Updated the getLanguage function to prioritize CLI arguments before reading from saved configuration.
- Refactored getLangFromArgs function to handle different command-line flags for language setting.
- Retained existing behavior for prompting user and saving configuration.
- Included dependencies like inquirer for user interaction.

These improvements enable more flexible and scriptable language configuration.

Related: config.js

#### 📄 i18n.js

### Changes in i18n.js

- Created a new module `i18n.js` to manage translations for multiple languages.
- Imported language-specific translation files `en.js` and `es.js`.
- Defined a `locales` object to store the language data.
- Implemented a `t` function to retrieve translations based on a key and language, with fallback to the key itself if not found.

Related: en.js, es.js

#### 📄 en.js

### Changes in en.js

- Introduced a new localization file for English language support.
- Added translations for API key usage, language selection, git operation prompts, and help commands.
- These strings facilitate internationalization and user guidance within the application.

This update enables the application to display messages and help instructions in English, improving usability for English-speaking users.

Related: en.js

#### 📄 es.js

### Changes in es.js

- Created a new localization module for Spanish language support with various interface strings.
- Included labels, help messages, and prompts related to API key usage, language selection, commit processes, and help commands.

This addition enables the application to display messages and prompts in Spanish, enhancing usability for Spanish-speaking users.

Related: es.js

---

---

## [idiomas] - 2025-05-26

### Commit: ee85ca8

#### 📄 index.js

### Changes in index.js

- Added a shebang line (`#!/usr/bin/env node`) to make the script executable directly from the command line.
- Introduced localization support by importing the `t` function from `../src/i18n.js`.
- Updated the `summarizeCommits` function to accept a `lang` parameter and use it for translations.
- Changed console output in `summarizeCommits` to use translated strings via `t()`.
- Modified the `main` function to capture the `lang` setting from the CLI setup and pass it to `summarizeCommits`.
- Ensured that all references to verbose and language settings are correctly propagated through the workflow.

Related: cliSetup.js, diffValidator.js, analyzeWithLLM.js, codeHandler.js, commitFlow.js, i18n.js

#### 📄 package.json

### Changes in package.json

- Added a "start" script to run the main index.js file (`node ./bin/index.js`).
- Included various project keywords related to git, commit, AI, CLI, OpenRouter, and LLM.
- Updated the author field with the maintainer's name and email.
- Added a project description in Spanish indicating it's a CLI for generating commit messages using AI and OpenRouter.
- No changes made to dependencies; only metadata and scripts are updated.

Related: index.js

#### 📄 cliSetup.js

### Changes in cliSetup.js

- Integrated language detection via command-line flags (`--lang`, `--en`, `--es`) with priority over saved config.
- Loaded existing language preference from configuration file.
- Added logic to save chosen language when `--help` is requested.
- Localized help message output based on detected language.
- Enhanced user prompts and logging with localized strings.
- Refactored API key display and confirmation prompts to support multiple languages.
- Implemented language resolution logic to determine final language setting.
- Updated imports to include `loadConfig` and `saveConfig` functions.

Related: config.js, gitHandler.js, i18n.js

#### 📄 config.js

### Changes in config.js

- Added support for alternative command-line flags `--es` and `--en` for setting the language.
- Improved the `getLangFromArgs` function to handle these new flags alongside `--lang`.
- Ensured that CLI arguments directly influence saved configuration and subsequent behavior.
- Maintained existing prompts and config saving logic, now with more flexible CLI options.
- Included the `inquirer` import and relevant configuration logic for user prompts.

Related: config.js

#### 📄 i18n.js

### Changes in i18n.js

- Introduced a new `i18n.js` module for basic internationalization.
- Imported language locale data for English (`en`) and Spanish (`es`) from local files.
- Created a `locales` object to store language data.
- Exported a `t` function to retrieve localized strings based on a key and optional language parameter, defaulting to English.
- If a key is not found for the specified language, the function returns the key itself.

Related: en.js, es.js

#### 📄 en.js

### Changes in en.js

- Created a new localization file exporting English strings for UI labels, command help, and messages.
- The strings include API key usage, language selection, git commands, and help information.
- Facilitates multi-language support for the application.

This setup allows the app to display messages and help texts in English, enhancing user accessibility.

Related: en.js

#### 📄 es.js

### Changes in es.js

- Introduced a new Spanish translation file with localized UI strings and messages for the application.
- Includes translations for API key usage, language selection, Git commit prompts, and help commands.
- This addition enhances multi-language support, making the app accessible to Spanish-speaking users.

Related: es.js, tsx

---
