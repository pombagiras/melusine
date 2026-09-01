// Generate comprehensive sitemap.xml for pombagiras.com
// Run: node generate_sitemap_audit.js

const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const BASE_URL = 'https://pombagiras.com';

// Folders/files to exclude
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /migrate_/,
  /fotos/,
  /\.agents/,
  /_template\.html$/,
  /googlecb60b92fff04fb46\.html$/
];

function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some(p => p.test(filePath));
}

function getHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (shouldExclude(fullPath)) continue;
    if (entry.isDirectory()) {
      getHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html')) {
      const stat = fs.statSync(fullPath);
      if (stat.size > 100) {
        files.push({ path: fullPath, lastMod: stat.mtime });
      }
    }
  }
  return files;
}

function getUrl(filePath) {
  let rel = filePath.substring(BASE_DIR.length).replace(/\\/g, '/');
  if (rel === '/index.html') return BASE_URL + '/';
  if (rel.endsWith('/index.html')) return BASE_URL + rel.replace(/\/index\.html$/, '/');
  return BASE_URL + rel;
}

function getPriority(url) {
  if (url === BASE_URL + '/') return '1.00';
  // Major sections
  const highPriority = ['/quiz/', '/oraculo/', '/crossroads/', '/guardias/', '/portal/', '/gira/', '/lebaras/', '/manifesto/', '/vortex/', '/github/', '/alexiamelusine/'];
  if (highPriority.some(p => url === BASE_URL + p)) return '0.90';
  // Entity root pages
  const entityDirs = ['/maria-padilha/', '/rosa-caveira/', '/dama-da-noite/', '/sete-saias/', '/sete-encruzilhadas/', '/cigana/', '/maria-mulambo/', '/maria-navalha/', '/maria-farrapo/', '/maria-quiteria/', '/menina/', '/da-lua/', '/da-praia/', '/da-serra/', '/da-sombra/', '/da-neblina/', '/da-fenda/', '/da-figueira/', '/do-fogo/', '/do-vento/', '/das-trevas/', '/das-almas/', '/calunga-profunda/', '/correntes/', '/aguas-profundas/', '/cacurucaia/', '/da-estrada/'];
  if (entityDirs.some(p => url === BASE_URL + p)) return '0.80';
  // Articles and subpages
  if (url.includes('/guardias/') || url.includes('/portal/') || url.includes('/gira/')) return '0.70';
  // Standalone articles
  if (url.endsWith('.html') && !url.includes('/')) return '0.65';
  return '0.60';
}

function getChangefreq(url) {
  if (url === BASE_URL + '/') return 'weekly';
  if (url.includes('/quiz/') || url.includes('/oraculo/')) return 'weekly';
  return 'monthly';
}

const files = getHtmlFiles(BASE_DIR);
const urls = files.map(f => ({
  url: getUrl(f.path),
  lastMod: f.lastMod.toISOString().split('T')[0],
  priority: null,
  changefreq: null
}));

// Sort URLs
urls.sort((a, b) => {
  // Home first
  if (a.url === BASE_URL + '/') return -1;
  if (b.url === BASE_URL + '/') return 1;
  return a.url.localeCompare(b.url);
});

// Assign priority and changefreq
urls.forEach(u => {
  u.priority = getPriority(u.url);
  u.changefreq = getChangefreq(u.url);
});

// Generate XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- Gerado via auditoria de SEO | Atualizado em: 2026-09-01 -->
`;

for (const u of urls) {
  xml += `
<url>
  <loc>${u.url}</loc>
  <lastmod>${u.lastMod}</lastmod>
  <changefreq>${u.changefreq}</changefreq>
  <priority>${u.priority}</priority>
</url>`;
}

xml += `
</urlset>
`;

const outPath = path.join(BASE_DIR, 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`Sitemap generated: ${urls.length} URLs written to ${outPath}`);
