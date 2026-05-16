# Diagram Rendering Guide

## Mermaid vs PlantUML

| Feature | Mermaid | PlantUML |
|---|---|---|
| Engine | Chromium (Puppeteer) | Java + Graphviz |
| Offline | Requires Chrome/Edge | Requires Java |
| Speed | Slower (browser startup) | Faster (JVM) |
| UML Support | Flowcharts, sequence, class, state | Full UML (all types) |
| Output | SVG, PNG, PDF | PNG, SVG, PDF, EPS |
| Syntax | Markdown-like | `@startuml` / `@enduml` |

## Environment Setup

### Mermaid

1. Install Node.js ≥ 18
2. Install Chrome, Edge, or Chromium
3. Install `@mermaid-js/mermaid-cli` globally, or let npx handle it

### PlantUML

1. Install Node.js ≥ 18 (for wrapper CLI)
2. Install Java JRE ≥ 8
3. Install Graphviz (optional but recommended for class/state/component diagrams)
4. Run `node scripts/plantuml-render.mjs --fix` to download `plantuml.jar`

## Quick Commands

```bash
# Mermaid
node skills/mermaid-render/scripts/mermaid-render.mjs diagram.mmd out.svg

# PlantUML
node skills/plantuml-render/scripts/plantuml-render.mjs diagram.puml out.svg -t svg
```
