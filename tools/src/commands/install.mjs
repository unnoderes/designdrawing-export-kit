import { installNpm, installSystemPackage, downloadJar } from '../utils/installer.mjs';
import { showConfirmDialog } from '../utils/dialogs.mjs';
import fs from 'fs';
import os from 'os';

const PLATFORM = os.platform();

const WINGET_LINUX_MAP = {
  'Graphviz.Graphviz': {
    apt: 'graphviz',
    dnf: 'graphviz',
    pacman: 'graphviz',
    yum: 'graphviz',
    zypper: 'graphviz'
  }
};

export async function install(what) {
  const [type, pkg] = what.split(':');

  if (type === 'npm') {
    const ok = showConfirmDialog(
      '安装缺失依赖',
      `检测到缺少 ${pkg}。\n\n是否通过 npm 全局安装？`
    );
    if (!ok) { console.log('用户取消了安装。'); return false; }
    return installNpm(pkg);
  }

  if (type === 'winget') {
    const ok = showConfirmDialog(
      '安装缺失依赖',
      `检测到缺少 ${pkg}。\n\n是否自动安装 / 显示安装命令？`
    );
    if (!ok) { console.log('用户取消了安装。'); return false; }

    if (PLATFORM === 'win32') {
      return installSystemPackage(pkg);
    }

    const mapping = WINGET_LINUX_MAP[pkg];
    if (mapping) {
      return installSystemPackage(pkg, mapping);
    }

    console.log(`winget package "${pkg}" has no known Linux mapping. Please install manually.`);
    return false;
  }

  if (type === 'jar') {
    const url = `https://github.com/plantuml/plantuml/releases/download/v1.2025.2/plantuml.jar`;
    const target = `./config/plantuml.jar`;
    const ok = showConfirmDialog(
      '安装缺失依赖',
      `检测到缺少 plantuml.jar。\n\n是否自动下载？`
    );
    if (!ok) { console.log('用户取消了下载。'); return false; }
    if (!fs.existsSync('config')) fs.mkdirSync('config');
    await downloadJar(url, target);
    console.log(`下载完成: ${target}`);
    return true;
  }

  console.error(`Unknown install type: ${type}`);
  return false;
}
