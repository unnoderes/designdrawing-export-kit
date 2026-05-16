#!/usr/bin/env node
import { install } from '../src/commands/install.mjs';
import { dialogTest } from '../src/commands/dialog-test.mjs';

function printHelp() {
  console.log(`
Usage: node tools/bin/dde-tools.mjs <command> [options]

Commands:
  install <what>        Install a dependency (npm|winget|jar)
  dialog-test           Show a test popup dialog
  help                  Show this help message

Examples:
  node tools/bin/dde-tools.mjs install npm:@mermaid-js/mermaid-cli
  node tools/bin/dde-tools.mjs install winget:Graphviz.Graphviz
  node tools/bin/dde-tools.mjs install jar:plantuml
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '-h' || command === '--help') {
    printHelp();
    process.exit(0);
  }

  if (command === 'install') {
    const what = args[1];
    if (!what) {
      console.error('Error: specify what to install (npm:pkg, winget:pkg, jar:name)');
      process.exit(1);
    }
    const ok = await install(what);
    process.exit(ok ? 0 : 1);
  }

  if (command === 'dialog-test') {
    await dialogTest();
    process.exit(0);
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

main();
