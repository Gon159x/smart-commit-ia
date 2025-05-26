# 🚀 Smart Commit IA

`ai-commit` es una herramienta de línea de comandos que **genera mensajes de commit inteligentes, contextuales y semánticamente relevantes**, utilizando modelos de lenguaje avanzados a través de la API de [OpenRouter](https://openrouter.ai).

🧠 A diferencia de otras herramientas, no solo resume archivos modificados: **entiende qué hiciste, por qué lo hiciste, y cómo se relacionan los cambios entre sí.** Analiza tu `git diff`, agrupa los cambios por funcionalidad, detecta patrones como refactorizaciones, internacionalización, mejoras de configuración y más, para generar commits claros, útiles y auditables.

Incluye un menú interactivo que te permite confirmar, modificar, copiar o ejecutar los commits directamente, así como generar automáticamente un `CHANGELOG.md`.

💼 Ideal para equipos que usan metodologías ágiles, desarrolladores que quieren mantener una buena higiene de commits, y flujos CI/CD que requieran trazabilidad de cambios.

---

## ✨ Características

- 🧠 Análisis semántico del `git diff` con contexto completo por archivo.
- 🔍 Detección de archivos eliminados o refactorizados con resumen de contenido.
- 🧩 Agrupación de cambios relacionados para generar commits independientes.
- 🧠 Selección del modelo LLM disponible en OpenRouter.
- 🧹 Opción de ejecutar `git add .` automáticamente.
- 🧭 Menú interactivo para elegir acciones: un solo commit, múltiples, unificados o copiar al portapapeles.
- 📄 Actualización automática de `CHANGELOG.md`.
- 🌍 Soporte multilenguaje: inglés y español.

---

## ⚙️ Requisitos

- 🟢 Node.js 18 o superior
- 🔑 API key válida de [OpenRouter](https://openrouter.ai)

---

## 📦 Instalación

```bash
npm i smart-commit-ia
```

---

## 🚀 Uso

1. Ejecuta `ai-commit` (o `node ./bin/index.js` si no hiciste `npm link`).
2. La primera vez se te pedirá una API key de OpenRouter y podrás elegir el modelo a utilizar.
3. La primera vez te preguntara que idioma quieres para la interfaz y el commit final.
4. Selecciona si quieres agregar todos los archivos cambiados al commit o selecciona manualmente cuales quiere commitear previamente con git add 'archivo'
5. Revisa los mensajes sugeridos y elige la acción deseada desde el menú interactivo.

📘 Todos los commits se generan en el idioma seleccionado y el historial se guarda en `CHANGELOG.md`.

---

## 🔧 Configuración

La API key de openrouter se pregunta la primera vez que se utiliza la herramienta y luego se guarda en:

```bash
~/.config/smart-commit-ia/config.json
```

Puedes editar o eliminar ese archivo para cambiar la clave.

---

## 🎥 DEMO

![Demostración de uso](https://github.com/Gon159x/smart-commit-ia/raw/main/media/demo.gif)

---

## 🌍 Repositorio

Este proyecto es de código abierto y está disponible en GitHub:

👉 [smart-commit-ia en GitHub](https://github.com/Gon159x/smart-commit-ia)

---

## 🧪 Roadmap

- 🐧 Compatibilidad con Linux
- 🌐 Soporte para más idiomas
- 🧠 Mejoras en prompting y segmentación
- 🆓 Compatibilidad con LLMs gratuitos (si el código está bien modularizado)
- 💡 Soporte para modelos como GPT-4.1-nano (~USD 0.10/millón tokens)
- 🔌 Compatibilidad con frameworks fuera del ecosistema JavaScript/Node.js
- 🧰 Ampliar soporte de flags para integración en scripts y flujos automatizados
- 🔐 Firma de commits con GPG usando clave propia de la herramienta
- 🧾 Detección de cambios posteriores vía trazabilidad en el changelog
- 🏷️ Marcar commits como generados por la IA

---

## 📄 Licencia

ISC
