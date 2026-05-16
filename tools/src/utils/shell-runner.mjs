import { execSync, spawn, spawnSync } from 'child_process';

/**
 * Execute a command synchronously and return trimmed stdout.
 * Returns null on failure.
 */
export function safeExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

/**
 * Execute a command synchronously with inherited stdio.
 * Throws on failure.
 */
export function runCommand(cmd, args = []) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`);
  }
  return result;
}

/**
 * Execute a command asynchronously with inherited stdio.
 * Returns a Promise.
 */
export function runCommandAsync(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    child.on('close', (code) => {
      if (code === 0) resolve(code);
      else reject(new Error(`Command exited with code ${code}`));
    });
    child.on('error', (err) => reject(err));
  });
}
