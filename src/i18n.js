import en from "./locales/en.js";
import es from "./locales/es.js";

const locales = { en, es };

export function t(key, lang = "en") {
  return locales[lang]?.[key] || key;
}
