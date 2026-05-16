---
name: mermaid-render
description: >
  Render Mermaid diagrams (.mmd) to SVG/PNG/PDF using a local Chrome/Edge/Chromium browser via Puppeteer.
  Trigger when the user asks to render, convert, draw, or export a Mermaid diagram, or mentions .mmd files.
triggers:
  - keywords: ["mermaid", "mmdc", ".mmd", "render diagram", "export mermaid"]
    threshold: 1
inputs:
  - name: input
    type: file
    description: Path to the .mmd source file
    required: true
  - name: output
    type: file
    description: Path for the rendered output. Defaults to input.svg
    required: false
  - name: format
    type: string
    description: Output format inferred from output extension (svg, png, pdf)
    required: false
    default: svg
outputs:
  - name: rendered_file
    type: file
    description: The generated diagram image or vector file
prerequisites:
  - Node.js >= 18
  - npm
  - Google Chrome / Microsoft Edge / Chromium
  - @mermaid-js/mermaid-cli (global or npx-ready)
---

# mermaid-render

## Purpose

Render Mermaid diagrams to SVG/PNG/PDF using a local browser.

## Path Policy

All path-related content must use local absolute paths. Do not write relative paths in artifacts.

## Trigger Gate

Use when the user clearly asks to:

- render a Mermaid diagram;
- convert a .mmd file to SVG/PNG/PDF;
- export or draw a Mermaid chart.

## Execution Flow

1. **Environment Check**: Verify Node.js, npm, mermaid-cli, and a browser are available. Auto-discover Chrome/Edge/Chromium.
2. **Auto-fix**: If mermaid-cli is missing, suggest `npm install -g @mermaid-js/mermaid-cli`.
3. **Render**: Generate a temporary `puppeteer-config.json` pointing to the discovered browser, then invoke mmdc.
4. **Result**: Return the absolute path of the rendered file.

## CLI Reference

```bash
node scripts/mermaid-render.mjs --check
node scripts/mermaid-render.mjs diagram.mmd
node scripts/mermaid-render.mjs diagram.mmd out.png
```

## Programmatic API

```js
import { check, convert } from './scripts/commands/render.mjs';

await check();               // Run environment checks
await convert('in.mmd', 'out.svg');  // Render diagram
```
