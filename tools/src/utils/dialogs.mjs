import { spawnSync } from 'child_process';

/**
 * Show a native Windows Yes/No dialog via PowerShell.
 * Returns true if user clicked Yes, false otherwise.
 */
export function showConfirmDialog(title, message) {
  const psScript = `Add-Type -AssemblyName System.Windows.Forms; $result = [System.Windows.Forms.MessageBox]::Show("${message}", "${title}", [System.Windows.Forms.MessageBoxButtons]::YesNo, [System.Windows.Forms.MessageBoxIcon]::Question); if ($result -eq [System.Windows.Forms.DialogResult]::Yes) { exit 0 } else { exit 1 }`;
  const result = spawnSync('powershell', ['-Command', psScript], { encoding: 'utf8' });
  return result.status === 0;
}

/**
 * Show a native Windows information dialog (OK only).
 */
export function showInfoDialog(title, message) {
  const psScript = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show("${message}", "${title}", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)`;
  spawnSync('powershell', ['-Command', psScript], { encoding: 'utf8' });
}
