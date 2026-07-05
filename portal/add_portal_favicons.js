const fs = require('fs');
const path = require('path');

const portalDir = __dirname;
const faviconUrl = 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/logo-192.png';

const faviconTags = `
    <link rel="icon" type="image/png" href="${faviconUrl}">
    <link rel="apple-touch-icon" href="${faviconUrl}">`;

try {
    const files = fs.readdirSync(portalDir);
    let updatedCount = 0;

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.html') {
            const filePath = path.join(portalDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            // Check if favicon link already exists in the head
            const hasFavicon = content.includes('rel="icon"') || content.includes("rel='icon'") || content.includes('rel="apple-touch-icon"');

            if (!hasFavicon) {
                // Find <head> tag (case-insensitive)
                const headRegex = /<head\b[^>]*>/i;
                const match = content.match(headRegex);

                if (match) {
                    const insertIndex = match.index + match[0].length;
                    content = content.slice(0, insertIndex) + faviconTags + content.slice(insertIndex);
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`[FAVICON - SUCESSO] Favicon adicionado em: ${file}`);
                updatedCount++;
            } else {
                console.log(`[FAVICON - PULAR] Já possui favicon ou <head> não encontrado: ${file}`);
            }
        }
    });

    console.log(`\nConcluído! ${updatedCount} arquivos HTML do portal foram atualizados com favicons.`);

} catch (err) {
    console.error('Erro ao adicionar favicons nas páginas do portal:', err);
}
