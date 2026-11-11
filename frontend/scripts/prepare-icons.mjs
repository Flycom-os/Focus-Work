import fs from 'node:fs';
import path from 'node:path';

const JETBRAINS_SRC = 'C:\\Users\\Nicka\\Downloads\\icons-master\\icons-master\\src';
const LUCIDE_SRC = 'C:\\Users\\Nicka\\Downloads\\lucide-main\\lucide-main\\icons';

const TARGET_DIR = path.resolve(process.cwd(), 'public', 'icons');
const JETBRAINS_DEST = path.join(TARGET_DIR, 'jetbrains');
const LUCIDE_DEST = path.join(TARGET_DIR, 'lucide');
const MANIFEST_DEST = path.resolve(process.cwd(), 'src', 'data', 'icons-manifest.json');

fs.mkdirSync(JETBRAINS_DEST, { recursive: true });
fs.mkdirSync(LUCIDE_DEST, { recursive: true });
fs.mkdirSync(path.dirname(MANIFEST_DEST), { recursive: true });

const manifest = [];

// 1. Process JetBrains
console.log('Copying JetBrains icons...');
const jbFiles = fs.readdirSync(JETBRAINS_SRC).filter(f => f.endsWith('.svg'));
for (const file of jbFiles) {
  const srcPath = path.join(JETBRAINS_SRC, file);
  const destPath = path.join(JETBRAINS_DEST, file);
  fs.copyFileSync(srcPath, destPath);

  const baseName = file.replace(/\.svg$/, '');
  let size = '16px';
  if (baseName.includes('-12px')) size = '12px';
  else if (baseName.includes('-20px')) size = '20px';
  else if (baseName.includes('-24px')) size = '24px';

  manifest.push({
    id: `jetbrains-${baseName}`,
    name: baseName,
    source: 'jetbrains',
    filename: file,
    path: `/icons/jetbrains/${file}`,
    size,
    tags: ['jetbrains', 'intellij'],
    categories: ['ui']
  });
}
console.log(`Copied ${jbFiles.length} JetBrains icons.`);

// 2. Process Lucide
console.log('Copying Lucide icons...');
const lucideFiles = fs.readdirSync(LUCIDE_SRC).filter(f => f.endsWith('.svg'));
for (const file of lucideFiles) {
  const srcPath = path.join(LUCIDE_SRC, file);
  const destPath = path.join(LUCIDE_DEST, file);
  fs.copyFileSync(srcPath, destPath);

  const baseName = file.replace(/\.svg$/, '');
  const jsonPath = path.join(LUCIDE_SRC, `${baseName}.json`);
  let tags = ['lucide'];
  let categories = ['general'];

  if (fs.existsSync(jsonPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (Array.isArray(meta.tags)) tags = [...new Set([...tags, ...meta.tags])];
      if (Array.isArray(meta.categories)) categories = meta.categories;
    } catch {
      // ignore json parse errors
    }
  }

  manifest.push({
    id: `lucide-${baseName}`,
    name: baseName,
    source: 'lucide',
    filename: file,
    path: `/icons/lucide/${file}`,
    size: '24px',
    tags,
    categories
  });
}
console.log(`Copied ${lucideFiles.length} Lucide icons.`);

fs.writeFileSync(MANIFEST_DEST, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Wrote manifest with ${manifest.length} icons to ${MANIFEST_DEST}`);
