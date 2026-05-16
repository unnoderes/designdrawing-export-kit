# Designdrawing Export Kit

本地图表渲染技能套件，支持 Mermaid 和 PlantUML 的离线渲染。

## 技能列表

- **mermaid-render**：将 Mermaid (.mmd) 图表渲染为 SVG/PNG/PDF。
- **plantuml-render**：将 PlantUML (.puml) 图表渲染为 PNG/SVG/PDF/EPS。

## 快速开始

```bash
# 检查 mermaid-render 环境
node skills/mermaid-render/scripts/mermaid-render.mjs --check

# 渲染 Mermaid 图
node skills/mermaid-render/scripts/mermaid-render.mjs diagram.mmd out.svg

# 检查 plantuml-render 环境
node skills/plantuml-render/scripts/plantuml-render.mjs --check

# 自动下载 plantuml.jar
node skills/plantuml-render/scripts/plantuml-render.mjs --fix

# 渲染 PlantUML 图
node skills/plantuml-render/scripts/plantuml-render.mjs diagram.puml out.svg -t svg
```

## 目录结构

```
Designdrawing-Export-kit/
├── skills/
│   ├── mermaid-render/
│   └── plantuml-render/
├── docs/
└── package.json
```

## License

MIT
