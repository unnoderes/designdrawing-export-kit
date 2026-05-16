import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PUML_JAR_NAME = 'plantuml.jar';
export const PUML_DOWNLOAD_URL = 'https://github.com/plantuml/plantuml/releases/download/v1.2025.2/plantuml.jar';

export function safeExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

export function findPlantUmlJar() {
  const skillConfig = path.join(__dirname, '..', '..', 'config', PUML_JAR_NAME);
  const candidates = [
    skillConfig,
    path.join(process.cwd(), PUML_JAR_NAME),
    path.join(process.cwd(), 'config', PUML_JAR_NAME),
    'C:\\plantuml.jar',
    '/opt/plantuml/plantuml.jar',
    '/usr/local/bin/plantuml.jar',
    '/usr/share/plantuml/plantuml.jar',
    '/usr/share/java/plantuml.jar',
    '/usr/local/share/plantuml.jar',
    '/usr/bin/plantuml.jar',
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  const pathVar = process.env.PATH || '';
  const sep = os.platform() === 'win32' ? ';' : ':';
  for (const dir of pathVar.split(sep)) {
    const p = path.join(dir.trim(), PUML_JAR_NAME);
    if (fs.existsSync(p)) return p;
  }

  return null;
}

export function downloadPlantUmlJar(targetPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(targetPath);
    https.get(PUML_DOWNLOAD_URL, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        https.get(res.headers.location, (redirectRes) => {
          if (redirectRes.statusCode !== 200) {
            return reject(new Error(`Redirect failed with ${redirectRes.statusCode}`));
          }
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(targetPath);
          });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(targetPath);
        });
      } else {
        reject(new Error(`Download failed with status ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}
