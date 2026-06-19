const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

function walkDir(dir, callback) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath, callback);
        } else if (path.extname(file).toLowerCase() === '.html') {
            callback(filePath);
        }
    }
}

// Process files in en/ and es/
const enDir = path.join(rootDir, 'en');
const esDir = path.join(rootDir, 'es');

function fixFiles(lang) {
    const baseDir = lang === 'en' ? enDir : esDir;
    if (!fs.existsSync(baseDir)) return;

    walkDir(baseDir, (filePath) => {
        let content = fs.readFileSync(filePath, 'utf8');
        const relPath = path.relative(baseDir, filePath).replace(/\\/g, '/');

        // A. Root index files (e.g. en/index.html)
        if (relPath === 'index.html') {
            console.log(`Fixing paths in root index: ${lang}/index.html`);
            // Adjust stylesheet, script, and video assets to go up 1 level
            content = content.replace(/href="style\.css\?v=1\.0\.1"/g, 'href="../style.css?v=1.0.1"');
            content = content.replace(/src="script\.js"/g, 'src="../script.js"');
            content = content.replace(/poster="ViboraAlbina_poster\.jpg"/g, 'poster="../ViboraAlbina_poster.jpg"');
            content = content.replace(/src="ViboraAlbina_725\.webm"/g, 'src="../ViboraAlbina_725.webm"'); // extra check
            content = content.replace(/src="ViboraAlbina_720\.webm"/g, 'src="../ViboraAlbina_720.webm"');
            content = content.replace(/src="ViboraAlbina_1080\.webm"/g, 'src="../ViboraAlbina_1080.webm"');
            content = content.replace(/src="ViboraAlbina_720\.mp4"/g, 'src="../ViboraAlbina_720.mp4"');
            content = content.replace(/src="ViboraAlbina_1080\.mp4"/g, 'src="../ViboraAlbina_1080.mp4"');
            
            // Fix double lang prefixes
            content = content.split(`href="${lang}/portal/dossie.html"`).join('href="portal/dossie.html"');
            content = content.split(`href="${lang}/portal/bahuchara-mata.html"`).join('href="portal/bahuchara-mata.html"');
            content = content.split(`href="${lang}/portal/natureza-humana.html"`).join('href="portal/natureza-humana.html"');
        }

        // B. Portal index file (e.g. en/portal/index.html)
        else if (relPath === 'portal/index.html') {
            console.log(`Fixing paths in portal index: ${lang}/portal/index.html`);
            content = content.replace(/href="style\.css"/g, 'href="../../portal/style.css"');
            content = content.replace(/src="script\.js"/g, 'src="../../portal/script.js"');
        }

        // C. Portal subpages (e.g. en/portal/dossie.html)
        else if (relPath.startsWith('portal/')) {
            console.log(`Fixing paths in portal subpage: ${lang}/${relPath}`);
            content = content.replace(/href="https:\/\/pombagiras\.com\/"/g, 'href="../index.html"');
            content = content.replace(/href="https:\/\/pombagiras\.com\/portal\/"/g, 'href="index.html"');
            content = content.replace(/href="\.\.\/privacy\.html"/g, 'href="../../privacy.html"');
            content = content.replace(/href="\.\.\/terms\.html"/g, 'href="../../terms.html"');
            
            // Remove double url absolute targets
            content = content.split(`href="https://pombagiras.com/${lang}/portal/dossie.html"`).join('href="dossie.html"');
            content = content.split(`href="https://pombagiras.com/${lang}/portal/bahuchara-mata.html"`).join('href="bahuchara-mata.html"');
            content = content.split(`href="https://pombagiras.com/${lang}/portal/natureza-humana.html"`).join('href="natureza-humana.html"');
        }

        // D. Guardias subpages and index (e.g. en/guardias/*.html)
        else if (relPath.startsWith('guardias/')) {
            console.log(`Fixing paths in guardias page: ${lang}/${relPath}`);
            content = content.replace(/href="\.\.\/style\.css"/g, 'href="../../style.css"');
            content = content.replace(/href="\.\.\/privacy\.html"/g, 'href="../../privacy.html"');
            content = content.replace(/href="\.\.\/terms\.html"/g, 'href="../../terms.html"');
            
            if (relPath === 'guardias/index.html') {
                content = content.replace(/href="https:\/\/pombagiras\.com\/"/g, 'href="../index.html"');
                content = content.replace(/href="https:\/\/pombagiras\.com\/portal\/"/g, 'href="../portal/index.html"');
            }
        }

        fs.writeFileSync(filePath, content, 'utf8');
    });
}

fixFiles('en');
fixFiles('es');
console.log('Path correction completed successfully.');
