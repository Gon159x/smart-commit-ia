# Smart Commit IA

`ai-commit` es una herramienta de línea de comandos que **genera mensajes de commit inteligentes, contextuales y semánticamente relevantes**, utilizando modelos de lenguaje avanzados a través de la API de [OpenRouter](https://openrouter.ai).

A diferencia de otras herramientas, no solo resume archivos modificados: **entiende qué hiciste, por qué lo hiciste, y cómo se relacionan los cambios entre sí.** Analiza tu `git diff`, agrupa los cambios por funcionalidad, detecta patrones como refactorizaciones, internacionalización, mejoras de configuración y más, para generar commits claros, útiles y auditables.

Incluye un menú interactivo que te permite confirmar, modificar, copiar o ejecutar los commits directamente, así como generar automáticamente un `CHANGELOG.md`.

Ideal para equipos que usan metodologías ágiles, desarrolladores que quieren mantener una buena higiene de commits, y flujos CI/CD que requieran trazabilidad de cambios.

## Características

- Analiza los cambios staged en tu repositorio y obtiene el contexto completo de cada archivo.
- Detecta archivos eliminados o refactorizados y resume su contenido.
- Agrupa archivos relacionados para generar commits independientes.
- Permite elegir el modelo LLM disponible en OpenRouter.
- Opcionalmente ejecuta `git add .` al iniciar para incluir los últimos cambios.
- Ofrece distintas acciones: un solo commit, múltiples commits, unificar todos o copiar al portapapeles.
- Actualiza un `CHANGELOG.md` con los resúmenes generados.
- Tiene soporte para idiomas de ingles y español

## Requisitos

- Node.js 18 o superior.
- Una API key válida de OpenRouter.

## Instalación

```bash
# Clona este repositorio y entra en la carpeta
git clone <repo-url>
cd smart-commit-ia

# Instala las dependencias
npm install

# Opcional: enlaza el comando globalmente
npm link
```

## Uso

1. Asegúrate de tener los cambios que quieres commitear en el _staging area_ (`git add`).
2. Ejecuta `ai-commit` (o `node ./bin/index.js` si no hiciste `npm link`).
3. La primera vez se te pedirá una API key de OpenRouter y podrás elegir el modelo a utilizar.
4. Revisa los mensajes sugeridos y elige la acción deseada desde el menú interactivo.

Todos los commits se generan en español por defecto y el historial se guarda en `CHANGELOG.md`.

## Configuración

La API key se guarda en `~/.config/smart-commit-ia/config.json`. Puedes editar o eliminar ese archivo para cambiar la clave.

## DEMO

![Demostración de uso](https://github.com/Gon159x/smart-commit-ia/raw/main/media/demo.gif)

## Repositorio

Este proyecto es de código abierto y está disponible en GitHub:

👉 [smart-commit-ia en GitHub](https://github.com/Gon159x/smart-commit-ia)

## Licencia

ISC
