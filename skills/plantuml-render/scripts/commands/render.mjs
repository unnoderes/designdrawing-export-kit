import { runAllChecks, printReport } from '../utils/env-check.mjs';
import { render as doRender } from '../utils/render.mjs';
import { findPlantUmlJar } from '../utils/plantuml-finder.mjs';

export async function render(input, output, options = {}) {
  const report = runAllChecks();
  const javaOk = report.checks.find(c => c.name === 'Java (JRE)').ok;
  if (!javaOk) {
    const err = new Error('Java is required. Run check() for details.');
    err.report = report;
    throw err;
  }

  const jarCheck = report.checks.find(c => c.name === 'plantuml.jar');
  const autoDownload = !jarCheck.ok;

  return doRender({
    input,
    output,
    format: options.format || 'png',
    jarPath: jarCheck.path,
    autoDownload,
    ...options
  });
}
