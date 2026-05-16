#!/usr/bin/env node
import { check } from './commands/check.mjs';
import { render } from './commands/render.mjs';
import { fix } from './commands/fix.mjs';

function printHelp() {
  console.log(`
Usage: node scripts/mermaid-render.mjs [options] <input.mmd> [output.svg]

Options:
  --check          Run environment checks and exit
  --fix            Auto-generate puppeteer config using discovered browser
  -h, --help       Show this help message

Examples:
  node scripts/mermaid-render.mjs diagram.mmd
  node scripts/mermaid-render.mjs diagram.mmd out.png
  node scripts/mermaid-render.mjs --check
`);
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
    await fix();
    process.exit(0);
  }

  const positional = args.filter(a => !a.startsWith('-'));
  const input = positional[0];
  const output = positional[1] || input.replace(/\.mmd$/i, '') + '.svg';

  if (!input) {
    console.error('Error: input file is required.');
    printHelp();
    process.exit(1);
  }

  // Pre-flight check with auto-install prompts
  const report = await check();
  if (!report.allOk) {
    console.error('\nAborted: environment check failed.');
    process.exit(1);
  }

  try {
    const result = await render(input, output);
    console.log(`\nRendered successfully: ${result}`);
  } catch (err) {
    console.error(`\nRender failed: ${err.message}`);
    process.exit(1);
  }
}

main();
