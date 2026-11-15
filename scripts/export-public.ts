import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Prefer a reviewed CMS public export; otherwise build the brief-based review content.
const root = process.cwd();
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'dad-pages-'));
try {
  const approved = path.join(root, 'content/public-data.json');
  if (fs.existsSync(approved)) {
    const content = JSON.parse(fs.readFileSync(approved, 'utf8'));
    const keys = ['profile','featuredProjects','allProjects','featuredNews','allNews','featuredPublications','allPublications','courses','opportunities'];
    if (!content.profile?.labName || keys.slice(1).some(key=>!Array.isArray(content[key]))) throw new Error('Invalid public CMS export');
    const publicOnly = Object.fromEntries(keys.map(key=>[key,content[key]]));
    fs.writeFileSync(path.join(root,'dist/public-data.json'),JSON.stringify(publicOnly));
  } else {
  // Ensure a deployment cannot accidentally read the machine's private CMS data.
  delete process.env.CMS_DATA_DIR;
  process.env.EXPORT_PUBLIC_DATA = 'true';
  process.chdir(temporary);
  const { getPublicBootstrap } = await import('../server.ts');
  fs.writeFileSync(path.join(root, 'dist/public-data.json'), JSON.stringify(getPublicBootstrap()));
  const { db } = await import('../server/db.ts');
  db.close();
  }
} finally {
  process.chdir(root);
  fs.rmSync(temporary, { recursive: true, force: true });
}
