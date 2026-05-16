import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import os from 'os';

/**
 * Attempts to locate a usable Chrome/Chromium/Edge executable on the host.
 * Returns the first match or null.
 */
export function findBrowser() {
  const platform = os.platform();
  const candidates = [];

  if (platform === 'win32') {
    const programFiles = [
      process.env['ProgramFiles'],
      process.env['ProgramFiles(x86)'],
      process.env['LocalAppData'],
    ].filter(Boolean);

    for (const base of programFiles) {
      candidates.push(
        path.join(base, 'Google', 'Chrome', 'Application', 'chrome.exe'),
        path.join(base, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
        path.join(base, 'Chromium', 'Application', 'chrome.exe')
      );
    }
  } else if (platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/opt/homebrew/bin/chromium',
      '/usr/local/bin/chromium'
    );
  } else {
    // Linux & others
    candidates.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/microsoft-edge',
      '/snap/bin/chromium'
    );
    try {
      const which = execSync('which google-chrome || which chromium || which chromium-browser || which microsoft-edge || which chrome', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      if (which) candidates.unshift(which);
    } catch {}
  }

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return null;
}
