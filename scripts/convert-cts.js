import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('./dist/index.d.cts');

try {
  let content = await fs.readFile(filePath, 'utf-8');

  content = content.replace(
    /export\s+\{\s*TheAuthAPI\s+as\s+default\s*\};?/,
    'exports = TheAuthAPI;',
  );

  await fs.writeFile(filePath, content, 'utf-8');
  console.log('✅ Converted export in index.d.cts');
} catch (err) {
  console.error('❌ Failed to update index.d.cts:', err);
}
