#!/usr/bin/env node
import { check } from './commands/check.mjs';
import { render } from './commands/render.mjs';
import { fix } from './commands/fix.mjs';

function printHelp() {
  console.log(`
Usage: node scripts/plantuml-render.mjs [options] <input.puml> [output]

Options:
  --check          Run environment checks and exit
  --fix            Auto-download plantuml.jar to config/
  -t, --type       Output format: png (default), svg, pdf, eps
  -h, --help       Show this help message

Examples:
  node scripts/plantuml-render.mjs diagram.puml
  node scripts/plantuml-render.mjs diagram.puml out.svg -t svg
  node scripts/plantuml-render.mjs --check
  node scripts/plantuml-render.mjs --fix
`);
}

function parseArgs(argv) {
  const positional = [];
  let type = 'png';

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-t' || a === '--type') {
      type = argv[++i] || 'png';
    } else if (a.startsWith('-t')) {
      type = a.slice(2) || argv[++i] || 'png';
    } else if (!a.startsWith('-')) {
      positional.push(a);
    }
  }

  return { positional, type };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--check')) {
    const report = await check();
    process.exit(report.allOk ? 0 : 1);
  }

  if (args.includes('--fix')) {
    try {
      await fix();
      process.exit(0);
    } catch {
      process.exit(1);
    }
  }

  const { positional, type } = parseArgs(args);
  const input = positional[0];
  const output = positional[1] || input.replace(/\.puml$/i, '') + `.${type}`;

  if (!input) {
    console.error('Error: input file is required.');
    printHelp();
    process.exit(1);
  }

  const report = await check();
  const javaOk = report.checks.find(c => c.name === 'Java (JRE)').ok;
  if (!javaOk) {
    console.error('\nAborted: Java is required to run PlantUML.');
    process.exit(1);
  }

  const gvOk = report.checks.find(c => c.name === 'Graphviz (dot)').ok;
  if (!gvOk) {
    console.warn('\nWarning: Graphviz not found. Some diagram types (class, component, state) may fail.');
    console.warn('Sequence diagrams and some others may still work.\n');
  }

  try {
    const result = await render(input, output, { format: type });
    console.log(`\nRendered successfully: ${result}`);
  } catch (err) {
    console.error(`\nRender failed: ${err.message}`);
    process.exit(1);
  }
}

main();
