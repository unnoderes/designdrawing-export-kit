import { runAllChecks, printReport } from '../utils/env-check.mjs';
import { render as doRender } from '../utils/render.mjs';

export async function render(input, output, options = {}) {
  const report = runAllChecks();
  if (!report.allOk) {
    const err = new Error('Environment check failed. Run check() for details.');
    err.report = report;
    throw err;
  }

  const mmdcCheck = report.checks.find(c => c.name === '@mermaid-js/mermaid-cli');
  const browserCheck = report.checks.find(c => c.name === 'Chrome / Edge / Chromium');

  return doRender({
    input,
    output,
    browserPath: browserCheck.path,
    mmdcPath: mmdcCheck.path,
    ...options
  });
}
