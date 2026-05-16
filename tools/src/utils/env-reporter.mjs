export function printReport(title, checks) {
  const allOk = checks.every(c => c.ok);
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log(`║${centerText(title, 44)}║`);
  console.log('╚════════════════════════════════════════════╝');
  console.log('');

  for (const c of checks) {
    const status = c.ok ? '✓' : '✗';
    console.log(`  ${status} ${c.name}`);
    if (c.version) console.log(`    Version: ${c.version}`);
    if (c.path)    console.log(`    Path: ${c.path}`);
    if (!c.ok)     console.log(`    Fix: ${c.fix}`);
    console.log('');
  }

  if (allOk) {
    console.log('Environment check passed. Ready to render.');
  } else {
    console.log('Some prerequisites are missing. See fix hints above.');
  }

  return { allOk, checks };
}

function centerText(text, width) {
  const pad = width - text.length;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
}
