import { showConfirmDialog, showInfoDialog } from '../utils/dialogs.mjs';

export async function dialogTest() {
  const result = showConfirmDialog(
    'Designdrawing Export Kit',
    '这是一个测试弹窗。\n\n点击“是”继续，点击“否”取消。'
  );
  console.log(`Confirm dialog result: ${result ? 'Yes' : 'No'}`);

  showInfoDialog(
    'Designdrawing Export Kit',
    '这是一个信息弹窗。\n\n仅用于展示提示信息。'
  );
}
