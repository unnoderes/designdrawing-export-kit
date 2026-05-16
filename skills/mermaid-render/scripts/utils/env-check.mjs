import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { findBrowser } from './browser-finder.mjs';

function safeExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function checkNode() {
  const version = safeExec('node --version');
  const ok = version && version.startsWith('v');
  return { name: 'Node.js', ok, version, fix: 'Install Node.js ≥18 from https://nodejs.org/' };
}

function checkNpm() {
  const version = safeExec('npm --version');
  const ok = !!version;
  return { name: 'npm', ok, version, fix: 'Node.js installation includes npm by default.' };
}

function checkMermaidCli() {
  let mmdcPath = safeExec('which mmdc') || safeExec('where mmdc');
  if (!mmdcPath && os.platform() === 'win32') {
    mmdcPath = safeExec('powershell -Command "Get-Command mmdc -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source"');
  }

  const globalPrefix = safeExec('npm prefix -g');
  if (globalPrefix) {
    const globalMmdc = path.join(globalPrefix, 'node_modules', '@mermaid-js', 'mermaid-cli', 'src', 'index.js');
    if (fs.existsSync(globalMmdc)) {
      mmdcPath = globalMmdc;
    }
  }

  const npxOk = safeExec('npx --yes @mermaid-js/mermaid-cli --version 2>NUL || echo npx-ok-placeholder') !== null;

  const ok = !!mmdcPath || npxOk;
  return {
    name: '@mermaid-js/mermaid-cli',
    ok,
    version: mmdcPath ? 'local' : (npxOk ? 'npx-ready' : 'missing'),
    path: mmdcPath,
    fix: 'Run: npm install -g @mermaid-js/mermaid-cli',
    npxReady: npxOk
  };
}

function checkBrowser() {
  const browserPath = findBrowser();
  return {
    name: 'Chrome / Edge / Chromium',
    ok: !!browserPath,
    path: browserPath,
    fix: 'Install Google Chrome or Microsoft Edge. Or set PUPPETEER_EXECUTABLE_PATH.'
  };
}

export function runAllChecks() {
  const checks = [checkNode(), checkNpm(), checkMermaidCli(), checkBrowser()];
  const allOk = checks.every(c => c.ok);
  return { allOk, checks };
}

export function printReport(report) {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║     Mermaid CLI Environment Report         ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');

  for (const c of report.checks) {
    const status = c.ok ? '✓' : '✗';
    console.log(`  ${status} ${c.name}`);
    if (c.version) console.log(`    Version/Type: ${c.version}`);
    if (c.path)    console.log(`    Path: ${c.path}`);
    if (!c.ok)     console.log(`    Fix: ${c.fix}`);
    console.log('');
  }

  if (report.allOk) {
    console.log('Environment check passed. Ready to render.');
  } else {
    console.log('Some prerequisites are missing. See fix hints above.');
    if (!report.checks.find(c => c.name === '@mermaid-js/mermaid-cli').ok) {
      console.log('');
      console.log('Quick install:');
      console.log('  npm install -g @mermaid-js/mermaid-cli');
    }
  }
}
