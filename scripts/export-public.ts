import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Build from a fresh seed database; never publish the CMS database or accounts.
const root = process.cwd();
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'dad-pages-'));
try {
  process.env.EXPORT_PUBLIC_DATA = 'true';
  process.chdir(temporary);
  const { getPublicBootstrap } = await import('../server.ts');
  fs.writeFileSync(path.join(root, 'dist/public-data.json'), JSON.stringify(getPublicBootstrap()));
  const { db } = await import('../server/db.ts');
  db.close();
} finally {
  process.chdir(root);
  fs.rmSync(temporary, { recursive: true, force: true });
}
