---
name: designdrawing-export-kit
description: Use as the package entry point for two independent diagram rendering skills. mermaid-render converts Mermaid (.mmd) diagrams to SVG/PNG/PDF via Chromium-backed Puppeteer. plantuml-render converts PlantUML (.puml) diagrams to PNG/SVG/PDF/EPS via Java runtime.
type: tool
---

# Designdrawing Export Kit

This package exposes two independent skills:

1. `mermaid-render` - render Mermaid diagrams to SVG/PNG/PDF using a local browser.
2. `plantuml-render` - render PlantUML diagrams to PNG/SVG/PDF/EPS using Java.

There is no shared router or external dispatch workflow.

## Selection

Use `mermaid-render` when the user asks to render, convert, draw, or export a Mermaid diagram, or mentions `.mmd` files.

Use `plantuml-render` when the user asks to render, convert, draw, or export a PlantUML diagram, mentions `.puml` files, or needs UML diagrams (sequence, class, state, component).

If the requested direction is unclear, ask the user to choose Mermaid or PlantUML before continuing.

## Tool Gates

When available from the repository root, use:

```powershell
node skills/mermaid-render/scripts/mermaid-render.mjs --check
node skills/mermaid-render/scripts/mermaid-render.mjs diagram.mmd out.svg
node skills/plantuml-render/scripts/plantuml-render.mjs --check
node skills/plantuml-render/scripts/plantuml-render.mjs --fix
node skills/plantuml-render/scripts/plantuml-render.mjs diagram.puml out.svg -t svg
```

## Path Policy

When any skill returns, writes, or asks another actor to use any document-related path, use the absolute path resolved in the current local work environment. Do not write relative paths such as `docs/plan.md`, `./README.md`, or `../repo/diagram.mmd` in artifacts.

## Package Rules

- Do not invent browser paths, jar paths, or repository state.
- Prefer auto-discovery of Chrome/Edge/Chromium and plantuml.jar.
- Keep mermaid-render and plantuml-render independent; do not introduce hidden cross-skill dependencies.
