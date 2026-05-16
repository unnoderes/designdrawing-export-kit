import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function render(opts) {
  return new Promise((resolve, reject) => {
    const { input, output, browserPath, mmdcPath, configFile } = opts;

    if (!fs.existsSync(input)) {
      return reject(new Error(`Input file not found: ${input}`));
    }

    const configDir = path.join(__dirname, '..', '..', 'config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const puppeteerConfig = path.join(configDir, 'puppeteer-config.json');
    const puppeteerPayload = browserPath
      ? { executablePath: browserPath }
      : {};
    fs.writeFileSync(puppeteerConfig, JSON.stringify(puppeteerPayload, null, 2));

    let command, args;
    if (mmdcPath && fs.existsSync(mmdcPath)) {
      command = process.execPath;
      args = [mmdcPath];
    } else {
      command = 'npx';
      args = ['-y', '@mermaid-js/mermaid-cli'];
    }

    args.push('-i', input, '-o', output, '-p', puppeteerConfig);
    if (configFile) {
      args.push('-c', configFile);
    }

    console.log(`Executing: ${command} ${args.join(' ')}`);
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`mmdc exited with code ${code}`));
      }
    });

    child.on('error', (err) => reject(err));
  });
}
