import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { runCommand } from './shell-runner.mjs';

export async function installNpm(packageName) {
  console.log(`Installing ${packageName} via npm...`);
  runCommand('npm', ['install', '-g', packageName]);
  return true;
}

export async function installWinget(packageId) {
  console.log(`Installing ${packageId} via winget...`);
  runCommand('winget', ['install', packageId, '--accept-package-agreements', '--accept-source-agreements']);
  return true;
}

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
