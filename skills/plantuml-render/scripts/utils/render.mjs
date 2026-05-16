import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { findPlantUmlJar, downloadPlantUmlJar } from './plantuml-finder.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function render(opts) {
  return new Promise((resolve, reject) => {
    const { input, output, format, jarPath, autoDownload } = opts;

    if (!fs.existsSync(input)) {
      return reject(new Error(`Input file not found: ${input}`));
    }

    let effectiveJar = jarPath;
    if (!effectiveJar && autoDownload) {
      const fallbackJar = path.join(__dirname, '..', '..', 'config', 'plantuml.jar');
      if (!fs.existsSync(fallbackJar)) {
        console.log('Downloading plantuml.jar...');
        downloadPlantUmlJar(fallbackJar)
          .then(() => doRender(fallbackJar, input, output, format, resolve, reject))
          .catch(reject);
        return;
      } else {
        effectiveJar = fallbackJar;
      }
    }

    if (!effectiveJar) {
      return reject(new Error('plantuml.jar not found. Run with --fix or place jar in project root.'));
    }

    doRender(effectiveJar, input, output, format, resolve, reject);
  });
}

function doRender(jar, input, output, format, resolve, reject) {
  const args = ['-jar', jar];
  if (output) {
    args.push('-o', path.dirname(output));
  }
  if (format) {
    args.push(`-t${format}`);
  }
  args.push(input);

  console.log(`Executing: java ${args.join(' ')}`);
  const child = spawn('java', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  child.on('close', (code) => {
    if (code === 0) {
      const outFile = output || input.replace(/\.puml$/i, '') + '.png';
      resolve(outFile);
    } else {
      reject(new Error(`PlantUML exited with code ${code}`));
    }
  });

  child.on('error', (err) => reject(err));
}
