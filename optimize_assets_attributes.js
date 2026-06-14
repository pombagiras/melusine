const fs = require('fs');
const path = require('path');

console.log("Iniciando otimização automatizada de atributos de imagens...");

// Função para buscar recursivamente todos os arquivos HTML
function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Ignorar pastas como .git, node_modules
            if (file !== '.git' && file !== 'node_modules' && file !== '.gemini' && file !== 'github') {
                getHtmlFiles(filePath, fileList);
            }
        } else if (path.extname(file).toLowerCase() === '.html') {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const htmlFiles = getHtmlFiles(__dirname);
let updatedCount = 0;

htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // RegEx para encontrar tags <img>
    // Captura toda a tag <img> para podermos analisar e atualizar seus atributos
    const imgRegex = /<img\s+([^>]*?)>/gi;
    
    content = content.replace(imgRegex, (fullTag, attributesPart) => {
        // Ignorar se já tem decoding="async" e loading="lazy" (ou se for marcado como prioritário)
        const hasDecoding = /decoding=["']async["']/i.test(attributesPart);
        const hasLoading = /loading=["']lazy["']/i.test(attributesPart);
        const isPriority = /fetchpriority=["']high["']/i.test(attributesPart) || /class=["'][^"']*?foto-perfil[^"']*?["']/i.test(attributesPart);

        let newAttributes = attributesPart;

        // Injetar decoding="async" se estiver faltando
        if (!hasDecoding) {
            newAttributes = newAttributes.trim() + ' decoding="async"';
            modified = true;
        }

        // Injetar loading="lazy" se não for prioritário e estiver faltando
        if (!hasLoading && !isPriority) {
            newAttributes = newAttributes.trim() + ' loading="lazy"';
            modified = true;
        }

        // Reconstrói a tag limpa e otimizada
        return `<img ${newAttributes.trim()}>`;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✔ Otimizado: ${path.relative(__dirname, filePath)}`);
        updatedCount++;
    }
});

console.log(`\nConcluído! ${updatedCount} arquivos HTML otimizados com atributos de imagem de alta performance.`);
