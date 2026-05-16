import { runAllChecks } from '../utils/env-check.mjs';
import { printReport } from '../../../../tools/src/utils/env-reporter.mjs';
import { showConfirmDialog, showInfoDialog } from '../../../../tools/src/utils/dialogs.mjs';
import { installWinget, downloadJar } from '../../../../tools/src/utils/installer.mjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function check() {
  let report = runAllChecks();
  printReport('PlantUML CLI Environment Report', report.checks);

  if (!report.allOk) {
    const javaCheck = report.checks.find(c => c.name === 'Java (JRE)');
    const gvCheck = report.checks.find(c => c.name === 'Graphviz (dot)');
    const jarCheck = report.checks.find(c => c.name === 'plantuml.jar');

    if (!javaCheck.ok) {
      showInfoDialog(
        '需要手动安装 Java',
        '未检测到 Java (JRE ≥ 8)。\n\n请手动安装：https://adoptium.net/'
      );
    }

    if (!gvCheck.ok) {
      const ok = showConfirmDialog(
        '安装缺失依赖',
        '检测到缺少 Graphviz (dot)。\n\n是否通过 winget 自动安装？'
      );
      if (ok) {
        try {
          await installWinget('Graphviz.Graphviz');
          report = runAllChecks();
          printReport('PlantUML CLI Environment Report', report.checks);
        } catch (err) {
          console.error('安装失败:', err.message);
        }
      } else {
        console.log('用户取消了 Graphviz 安装。');
      }
    }

    if (!jarCheck.ok) {
      const ok = showConfirmDialog(
        '安装缺失依赖',
        '检测到缺少 plantuml.jar。\n\n是否自动下载？'
      );
      if (ok) {
        const configDir = path.join(__dirname, '..', '..', 'config');
        if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
        const target = path.join(configDir, 'plantuml.jar');
        try {
          await downloadJar(
            'https://github.com/plantuml/plantuml/releases/download/v1.2025.2/plantuml.jar',
            target
          );
          console.log(`下载完成: ${target}`);
          report = runAllChecks();
          printReport('PlantUML CLI Environment Report', report.checks);
        } catch (err) {
          console.error(`下载失败: ${err.message}`);
        }
      } else {
        console.log('用户取消了 plantuml.jar 下载。');
      }
    }
  }

  return report;
}
