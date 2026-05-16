---
name: plantuml-render
description: >
  Render PlantUML diagrams (.puml) to PNG/SVG/PDF/EPS using the local Java runtime.
  Trigger when the user asks to render, convert, draw, or export a PlantUML diagram,
  or mentions .puml files and Java-based UML rendering.
triggers:
  - keywords: ["plantuml", ".puml", "uml diagram", "render uml", "sequence diagram", "class diagram"]
    threshold: 1
inputs:
  - name: input
    type: file
    description: Path to the .puml source file
    required: true
  - name: output
    type: file
    description: Path for the rendered output. Defaults to input.png
    required: false
  - name: format
    type: string
    description: Output format (png, svg, pdf, eps)
    required: false
    default: png
outputs:
  - name: rendered_file
    type: file
    description: The generated diagram image or vector file
prerequisites:
  - Node.js >= 18 (for the wrapper CLI)
  - Java JRE >= 8
  - Graphviz (optional; required for class/state/component diagrams)
  - plantuml.jar (auto-downloaded via --fix if missing)
---

# plantuml-render

## Purpose

Render PlantUML diagrams to PNG/SVG/PDF/EPS using Java.

## Path Policy

All path-related content must use local absolute paths. Do not write relative paths in artifacts.

## Trigger Gate

Use when the user clearly asks to:

- render a PlantUML diagram;
- convert a .puml file to PNG/SVG/PDF/EPS;
- export or draw a UML diagram.

## Execution Flow

1. **Environment Check**: Verify Java, Graphviz (dot), and plantuml.jar. Auto-discover or download jar.
2. **Auto-fix**: `--fix` downloads the latest plantuml.jar from GitHub releases. Graphviz is optional; sequence diagrams work without it.
3. **Render**: Invoke `java -jar plantuml.jar` with the appropriate format flag.
4. **Result**: Return the absolute path of the rendered file.

## CLI Reference

```bash
node scripts/plantuml-render.mjs --check
node scripts/plantuml-render.mjs --fix
node scripts/plantuml-render.mjs diagram.puml
node scripts/plantuml-render.mjs diagram.puml out.svg -t svg
```

## Programmatic API

```js
import { check, convert } from './scripts/commands/render.mjs';

await check();                          // Run environment checks
await convert('in.puml', 'out.svg', { format: 'svg' });  // Render diagram
```
