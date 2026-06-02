const fs = require('fs');
const path = require('path');

const portalDir = path.join(__dirname, '.');

try {
    const files = fs.readdirSync(portalDir);
    let updatedCount = 0;

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.html') {
            const filePath = path.join(portalDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            // 1. Substituir variáveis do tema embutidas no :root de cada subpágina
            if (content.includes('--accent-red') || content.includes('--text-color')) {
                content = content.replace(/--accent-red:\s*hsl\(350,\s*78%,\s*45%\);/gi, "--accent-red: #4A0E17; /* Oxblood */");
                content = content.replace(/--accent-red:\s*#8b1e5c;/gi, "--accent-red: #4A0E17; /* Oxblood */");
                content = content.replace(/--accent-red-bright:\s*hsl\(350,\s*85%,\s*52%\);/gi, "--accent-red-bright: #800020; /* Vibrant Oxblood */");
                content = content.replace(/--text-color:\s*#e0e0e0;/gi, "--text-color: #FAF6EE; /* Creme Quente */");
                content = content.replace(/--muted-text:\s*hsl\(350,\s*8%,\s*70%\);/gi, "--muted-text: #78868c; /* Slate */");
                content = content.replace(/--glass-bg:\s*rgba\(8,\s*2,\s*4,\s*0\.85\);/gi, "--glass-bg: rgba(10, 12, 14, 0.9);");
                content = content.replace(/--glass-border:\s*hsla\(350,\s*78%,\s*45%,\s*0\.25\);/gi, "--glass-border: rgba(197, 160, 89, 0.2);");
                content = content.replace(/--shadow-glow:\s*hsla\(350,\s*78%,\s*45%,\s*0\.15\);/gi, "--shadow-glow: rgba(128, 0, 32, 0.12);");
                modified = true;
            }

            // 2. Substituir gradientes de fundo do body e divisores horizontais nas subpáginas
            if (content.includes('#020000') || content.includes('#0e0104')) {
                content = content.replace(/linear-gradient\(135deg,\s*#020000\s*0%,\s*#0e0104\s*100%\)/gi, "linear-gradient(135deg, #050505 0%, #121719 100%)");
                modified = true;
            }
            if (content.includes('rgba(139, 0, 0, 0.05)')) {
                content = content.replace(/rgba\(139,\s*0,\s*0,\s*0\.05\)/gi, "rgba(74, 14, 23, 0.04)"); // Oxblood soft spec-item
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`[CROMÁTICA - SUCESSO] Arquivo atualizado: ${file}`);
                updatedCount++;
            }
        }
    });

    console.log(`\nConcluído! ${updatedCount} arquivos HTML do portal foram migrados com sucesso para a paleta premium.`);

} catch (err) {
    console.error('Erro ao migrar paleta cromática do portal:', err);
}
