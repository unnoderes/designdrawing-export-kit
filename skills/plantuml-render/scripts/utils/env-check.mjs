import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { findPlantUmlJar } from './plantuml-finder.mjs';

function safeExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function checkJava() {
  const version = safeExec('java -version 2>&1');
  const ok = !!version;
  return {
    name: 'Java (JRE)',
    ok,
    version: ok ? version.split('\n')[0] : null,
    fix: 'Install Java JRE 8+ from https://adoptium.net/',
    path: safeExec('which java') || safeExec('where java')
  };
}

function checkGraphviz() {
  const version = safeExec('dot -V 2>&1');
  const ok = !!version;
  return {
    name: 'Graphviz (dot)',
    ok,
    version: ok ? version : null,
    fix: 'Install Graphviz from https://graphviz.org/download/',
    path: safeExec('which dot') || safeExec('where dot')
  };
}

function checkPlantUml() {
  const jarPath = findPlantUmlJar();
  return {
    name: 'plantuml.jar',
    ok: !!jarPath,
    path: jarPath,
    fix: 'Run with --fix to auto-download plantuml.jar, or place it in project root/config/.'
  };
}

export function runAllChecks() {
  const checks = [checkJava(), checkGraphviz(), checkPlantUml()];
  const allOk = checks.every(c => c.ok);
  return { allOk, checks };
}

export function printReport(report) {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║    PlantUML CLI Environment Report         ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');

  for (const c of report.checks) {
    const status = c.ok ? '✓' : '✗';
    console.log(`  ${status} ${c.name}`);
    if (c.version) console.log(`    Version: ${c.version}`);
    if (c.path)    console.log(`    Path: ${c.path}`);
    if (!c.ok)     console.log(`    Fix: ${c.fix}`);
    console.log('');
  }

  if (report.allOk) {
    console.log('Environment check passed. Ready to render.');
  } else {
    console.log('Some prerequisites are missing. See fix hints above.');
    console.log('');
    console.log('Quick install:');
    console.log('  1. Java:     https://adoptium.net/');
    console.log('  2. Graphviz: https://graphviz.org/download/');
    console.log('  3. plantuml.jar: node scripts/plantuml-render.mjs --fix');
  }
}
