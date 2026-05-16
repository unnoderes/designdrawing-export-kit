import { runAllChecks } from '../utils/env-check.mjs';
import { printReport } from '../../../../tools/src/utils/env-reporter.mjs';
import { showConfirmDialog, showInfoDialog } from '../../../../tools/src/utils/dialogs.mjs';
import { installNpm } from '../../../../tools/src/utils/installer.mjs';

export async function check() {
  let report = runAllChecks();
  printReport('Mermaid CLI Environment Report', report.checks);

  if (!report.allOk) {
    const mmdcCheck = report.checks.find(c => c.name === '@mermaid-js/mermaid-cli');
    const browserCheck = report.checks.find(c => c.name === 'Chrome / Edge / Chromium');

    if (!mmdcCheck.ok) {
      const ok = showConfirmDialog(
        '安装缺失依赖',
        '检测到缺少 @mermaid-js/mermaid-cli。\n\n是否通过 npm 全局安装？'
      );
      if (ok) {
        try {
          await installNpm('@mermaid-js/mermaid-cli');
          report = runAllChecks();
          printReport('Mermaid CLI Environment Report', report.checks);
        } catch (err) {
          console.error('安装失败:', err.message);
        }
      } else {
        console.log('用户取消了安装。');
      }
    }

    if (!browserCheck.ok) {
      showInfoDialog(
        '需要手动安装浏览器',
        '未检测到 Chrome / Edge / Chromium。\n\n请手动安装：\n  - Google Chrome: https://www.google.com/chrome/\n  - Microsoft Edge: https://www.microsoft.com/edge'
      );
    }
  }

  return report;
}
