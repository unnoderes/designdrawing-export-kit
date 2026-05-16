import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { downloadPlantUmlJar } from '../utils/plantuml-finder.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function fix() {
  const configDir = path.join(__dirname, '..', '..', 'config');
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  const target = path.join(configDir, 'plantuml.jar');
  if (fs.existsSync(target)) {
    console.log(`plantuml.jar already exists at ${target}`);
    return;
  }
  console.log('Downloading plantuml.jar...');
  try {
    await downloadPlantUmlJar(target);
    console.log(`Downloaded to ${target}`);
  } catch (err) {
    console.error(`Download failed: ${err.message}`);
    console.error('You can also manually download from https://plantuml.com/download');
    throw err;
  }
}
