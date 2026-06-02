const fs = require('fs');
const path = require('path');

const portalDir = path.join(__dirname, '.');

// Regex para encontrar qualquer link do Google Fonts contendo Inter e Outfit
const fontLinkRegex = /<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^"]*Outfit[^"]*"[^>]*>/gi;

// Nova URL de importação unificada do Google Fonts
const newFontLink = '<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet">';

try {
    const files = fs.readdirSync(portalDir);
    let updatedCount = 0;

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.html') {
            const filePath = path.join(portalDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            // 1. Substituir link de importação de fontes
            if (fontLinkRegex.test(content)) {
                content = content.replace(fontLinkRegex, newFontLink);
                modified = true;
            }

            // 2. Substituir referências inline de font-family
            if (content.includes("'Inter'") || content.includes("'Outfit'") || content.includes("Inter, sans-serif") || content.includes("Outfit, sans-serif")) {
                content = content.replace(/'Inter',\s*sans-serif/gi, "'Geist', sans-serif");
                content = content.replace(/'Outfit',\s*sans-serif/gi, "'Fraunces', serif");
                content = content.replace(/font-family:\s*Inter,/gi, "font-family: 'Geist',");
                content = content.replace(/font-family:\s*Outfit,/gi, "font-family: 'Fraunces',");
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`[SUCESSO] Arquivo atualizado: ${file}`);
                updatedCount++;
            }
        }
    });

    console.log(`\nConcluído! ${updatedCount} arquivos HTML do portal foram migrados com sucesso.`);

} catch (err) {
    console.error('Erro ao ler a pasta do portal:', err);
}
