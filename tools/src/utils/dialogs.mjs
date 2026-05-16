import { spawnSync } from 'child_process';
import readline from 'readline';
import os from 'os';

const PLATFORM = os.platform();

/* ------------------------------------------------------------------ */
/*  Linux helpers                                                     */
/* ------------------------------------------------------------------ */

function tryZenity(type, title, message) {
  const args = type === 'confirm'
    ? ['--question', '--title', title, '--text', message]
    : ['--info', '--title', title, '--text', message];
  const result = spawnSync('zenity', args, { encoding: 'utf8' });
  if (result.error && result.error.code === 'ENOENT') return null;
  return result.status === 0;
}

function tryKdialog(type, title, message) {
  const args = type === 'confirm'
    ? ['--yesno', message, '--title', title]
    : ['--msgbox', message, '--title', title];
  const result = spawnSync('kdialog', args, { encoding: 'utf8' });
  if (result.error && result.error.code === 'ENOENT') return null;
  return result.status === 0;
}

function terminalConfirm(title, message) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const prompt = `[${title}] ${message}\n[Y/n] `;
  const answer = rl.question(prompt);
  rl.close();
  return !answer || answer.toLowerCase().startsWith('y');
}

function terminalInfo(title, message) {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log(`║${centerText(title, 44)}║`);
  console.log('╠════════════════════════════════════════════╣');
  const lines = message.split('\n');
  for (const line of lines) {
    const truncated = line.length > 44 ? line.slice(0, 41) + '...' : line;
    const padded = truncated.padEnd(44, ' ');
    console.log(`║ ${padded}║`);
  }
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
}

function centerText(text, width) {
  const pad = width - text.length;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
}

/* ------------------------------------------------------------------ */
/*  Windows helpers                                                   */
/* ------------------------------------------------------------------ */

function winConfirm(title, message) {
  const psScript = `Add-Type -AssemblyName System.Windows.Forms; $result = [System.Windows.Forms.MessageBox]::Show("${message}", "${title}", [System.Windows.Forms.MessageBoxButtons]::YesNo, [System.Windows.Forms.MessageBoxIcon]::Question); if ($result -eq [System.Windows.Forms.DialogResult]::Yes) { exit 0 } else { exit 1 }`;
  const result = spawnSync('powershell', ['-Command', psScript], { encoding: 'utf8' });
  return result.status === 0;
}

function winInfo(title, message) {
  const psScript = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show("${message}", "${title}", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)`;
  spawnSync('powershell', ['-Command', psScript], { encoding: 'utf8' });
}

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

export function showConfirmDialog(title, message) {
  if (PLATFORM === 'win32') {
    return winConfirm(title, message);
  }

  // Linux / macOS / others
  let result = tryZenity('confirm', title, message);
  if (result !== null) return result;

  result = tryKdialog('confirm', title, message);
  if (result !== null) return result;

  return terminalConfirm(title, message);
}

export function showInfoDialog(title, message) {
  if (PLATFORM === 'win32') {
    winInfo(title, message);
    return;
  }

  // Linux / macOS / others
  const zenity = tryZenity('info', title, message);
  if (zenity !== null) return;

  const kdialog = tryKdialog('info', title, message);
  if (kdialog !== null) return;

  terminalInfo(title, message);
}
