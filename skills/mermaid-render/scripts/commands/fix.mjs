import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { findBrowser } from '../utils/browser-finder.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function fix() {
  const browser = findBrowser();
  const configDir = path.join(__dirname, '..', '..', 'config');
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  const target = path.join(configDir, 'puppeteer-config.json');
  const payload = browser ? { executablePath: browser } : {};
  fs.writeFileSync(target, JSON.stringify(payload, null, 2));
  console.log(browser
    ? `Puppeteer config written to ${target} using ${browser}`
    : `No browser found. Config written empty to ${target}`);
}
