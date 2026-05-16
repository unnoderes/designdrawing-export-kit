import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';
import os from 'os';
import { runCommand } from './shell-runner.mjs';

const PLATFORM = os.platform();

/* ------------------------------------------------------------------ */
/*  npm (cross-platform)                                              */
/* ------------------------------------------------------------------ */

export async function installNpm(packageName) {
  console.log(`Installing ${packageName} via npm...`);
  runCommand('npm', ['install', '-g', packageName]);
  return true;
}

/* ------------------------------------------------------------------ */
/*  Windows: winget                                                   */
/* ------------------------------------------------------------------ */

export async function installWinget(packageId) {
  console.log(`Installing ${packageId} via winget...`);
  runCommand('winget', ['install', packageId, '--accept-package-agreements', '--accept-source-agreements']);
  return true;
}

/* ------------------------------------------------------------------ */
/*  Linux: package manager detection & instructions                  */
/* ------------------------------------------------------------------ */

function detectLinuxPackageManager() {
  const managers = ['apt-get', 'dnf', 'yum', 'pacman', 'zypper', 'brew'];
  for (const mgr of managers) {
    try {
      execSync(`which ${mgr}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      return mgr;
    } catch {
      // not found
    }
  }
  return null;
}

function printLinuxInstallInstructions(linuxMapping) {
  const mgr = detectLinuxPackageManager();
  if (!mgr) {
    console.log('');
    console.log('No supported package manager found (tried: apt-get, dnf, yum, pacman, zypper, brew).');
    console.log('Please install the dependency manually. Common package names:');
    for (const [k, v] of Object.entries(linuxMapping)) {
      console.log(`  ${k}: ${v}`);
    }
    console.log('');
    return false;
  }

  const pkg = linuxMapping[mgr];
  if (!pkg) {
    console.log(`Package name not mapped for ${mgr}. Please install manually.`);
    return false;
  }

  const cmd = mgr === 'apt-get'
    ? `sudo apt-get update && sudo apt-get install -y ${pkg}`
    : mgr === 'dnf'
      ? `sudo dnf install -y ${pkg}`
      : mgr === 'yum'
        ? `sudo yum install -y ${pkg}`
        : mgr === 'pacman'
          ? `sudo pacman -S --noconfirm ${pkg}`
          : mgr === 'zypper'
            ? `sudo zypper install -y ${pkg}`
            : `brew install ${pkg}`;

  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  Manual installation required on Linux     ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`Detected package manager: ${mgr}`);
  console.log(`Run the following command to install:`);
  console.log('');
  console.log(`  ${cmd}`);
  console.log('');
  return false;
}

/* ------------------------------------------------------------------ */
/*  Unified system package installer                                  */
/* ------------------------------------------------------------------ */

export async function installSystemPackage(wingetId, linuxMapping) {
  if (PLATFORM === 'win32') {
    return installWinget(wingetId);
  }
  return printLinuxInstallInstructions(linuxMapping);
}

/* ------------------------------------------------------------------ */
/*  JAR download (cross-platform)                                     */
/* ------------------------------------------------------------------ */

export async function downloadJar(url, targetPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(targetPath);
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        https.get(res.headers.location, (redirectRes) => {
          if (redirectRes.statusCode !== 200) {
            return reject(new Error(`Redirect failed with ${redirectRes.statusCode}`));
          }
          redirectRes.pipe(file);
          file.on('finish', () => { file.close(); resolve(targetPath); });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(targetPath); });
      } else {
        reject(new Error(`Download failed with status ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}
