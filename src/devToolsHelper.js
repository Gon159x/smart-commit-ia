import readline from "readline";
import { t } from "./i18n.js";

export async function waitForUserInput(
  message,
  lang = "en"
) {
  const finalMsg = message || t("pressEnter", lang);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(`${finalMsg}\n`, () => {
      rl.close();
      resolve();
    })
  );
}
